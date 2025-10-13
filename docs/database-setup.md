# Database Setup Documentation

This document contains all the PostgreSQL/Supabase database setup commands required for the JumpSquare application.

## Required Extensions

```sql
-- Enable pg_trgm extension for better partial matching and typo tolerance
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable unaccent extension for removing accents from characters
CREATE EXTENSION IF NOT EXISTS unaccent;
```

## Performance Indexes

### GIN Indexes for ILIKE searches (trigram matching)
```sql
-- For partial text matching on movie titles
CREATE INDEX IF NOT EXISTS idx_v3_movies_title_gin ON v3_movies USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_v3_movie_translations_title_gin ON v3_movie_translations USING GIN (title gin_trgm_ops);
```

### GIN Indexes for Full-Text Search
```sql
-- For intelligent full-text search on movie titles
CREATE INDEX IF NOT EXISTS idx_v3_movies_title_fts ON v3_movies USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_v3_movie_translations_title_fts ON v3_movie_translations USING GIN (to_tsvector('english', title));
```

## Custom RPC Functions

### search_movies Function
This function provides hybrid search capabilities across both original and translated movie titles for the main search API.

**Features:**
- Full-text search with relevance ranking (priority 1 & 3)
- ILIKE fallback for partial matches (priority 2 & 4)
- Searches both `v3_movies.title` and `v3_movie_translations.title`
- Returns complete movie data with related directors, genres, and translations

```sql
CREATE OR REPLACE FUNCTION search_movies(
  search_query TEXT,
  result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  year INTEGER,
  rating TEXT,
  jumpscare_count INTEGER,
  runtime_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  original_language TEXT,
  v3_movie_directors JSONB,
  v3_movie_genres JSONB,
  v3_movie_translations JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH movie_matches AS (
    -- Full-text search in original titles (highest priority)
    SELECT DISTINCT m.id as movie_id, 1 as priority,
           ts_rank(to_tsvector('english', m.title), plainto_tsquery('english', search_query)) as rank
    FROM v3_movies m
    WHERE to_tsvector('english', m.title) @@ plainto_tsquery('english', search_query)
    
    UNION
    
    -- ILIKE fallback for original titles (medium priority)
    SELECT DISTINCT m.id as movie_id, 2 as priority, 0.5 as rank
    FROM v3_movies m
    WHERE m.title ILIKE '%' || search_query || '%'
    AND NOT EXISTS (
      SELECT 1 FROM v3_movies m2 
      WHERE m2.id = m.id 
      AND to_tsvector('english', m2.title) @@ plainto_tsquery('english', search_query)
    )
    
    UNION
    
    -- Full-text search in translated titles (lower priority)
    SELECT DISTINCT mt.movie_id, 3 as priority,
           ts_rank(to_tsvector('english', mt.title), plainto_tsquery('english', search_query)) as rank
    FROM v3_movie_translations mt
    WHERE to_tsvector('english', mt.title) @@ plainto_tsquery('english', search_query)
    
    UNION
    
    -- ILIKE fallback for translated titles (lowest priority)
    SELECT DISTINCT mt.movie_id, 4 as priority, 0.3 as rank
    FROM v3_movie_translations mt
    WHERE mt.title ILIKE '%' || search_query || '%'
    AND NOT EXISTS (
      SELECT 1 FROM v3_movie_translations mt2 
      WHERE mt2.movie_id = mt.movie_id 
      AND to_tsvector('english', mt2.title) @@ plainto_tsquery('english', search_query)
    )
  ),
  ranked_movies AS (
    SELECT 
      mm.movie_id,
      MIN(mm.priority) as best_priority,
      MAX(mm.rank) as best_rank
    FROM movie_matches mm
    GROUP BY mm.movie_id
  )
  SELECT 
    m.id,
    m.title,
    m.year,
    m.rating,
    m.jumpscare_count,
    m.runtime_minutes,
    m.description,
    m.created_at,
    m.updated_at,
    m.original_language,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'v3_directors', jsonb_build_object(
            'id', d.id,
            'name', d.name
          )
        )
      )
      FROM v3_movie_directors md
      JOIN v3_directors d ON d.id = md.director_id
      WHERE md.movie_id = m.id), '[]'::jsonb
    ) as v3_movie_directors,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'v3_genres', jsonb_build_object(
            'id', g.id,
            'name', g.name
          )
        )
      )
      FROM v3_movie_genres mg
      JOIN v3_genres g ON g.id = mg.genre_id
      WHERE mg.movie_id = m.id), '[]'::jsonb
    ) as v3_movie_genres,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'iso_639_1', mt.iso_639_1,
          'title', mt.title,
          'iso_3166_1', mt.iso_3166_1
        )
      )
      FROM v3_movie_translations mt
      WHERE mt.movie_id = m.id), '[]'::jsonb
    ) as v3_movie_translations
  FROM ranked_movies rm
  JOIN v3_movies m ON m.id = rm.movie_id
  ORDER BY rm.best_priority, rm.best_rank DESC, m.year DESC, m.title
  LIMIT result_limit;
END;
$$;
```

### find_movie_exact Function
Optimized function for exact title matching, designed for browser extension API usage.

**Features:**
- Single efficient query across both original and translated titles
- Smart year tolerance (±1 year) instead of exact matching
- **Normalized title matching**: Handles special characters, accents, and punctuation
- Prioritized matching: exact normalized > similarity fallback
- Returns minimal movie data for performance

**Year Logic:**
- If year provided: only matches within ±1 year tolerance
- Multiple matches: selects closest year to target
- Single match: validates year is within tolerance range

**Normalization:**
- Removes accents (café → cafe)
- Converts superscript numbers ([REC]² → rec2, [REC] 2 → rec2)
- Removes special characters and spaces ([•REC]³ - La genesi → rec3lagenesi)
- Converts to lowercase
- **Note**: unaccent extension handles accented letters but NOT superscript numbers

```sql
-- Helper function to normalize text for matching
CREATE OR REPLACE FUNCTION normalize_title(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      unaccent(
        -- Replace superscript numbers with regular numbers BEFORE unaccent
        -- Note: unaccent doesn't handle superscripts, so we do it manually
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    regexp_replace(
                      regexp_replace(
                        regexp_replace(
                          regexp_replace(text_input, '⁰', '0', 'g'),
                        '¹', '1', 'g'),
                      '²', '2', 'g'),
                    '³', '3', 'g'),
                  '⁴', '4', 'g'),
                '⁵', '5', 'g'),
              '⁶', '6', 'g'),
            '⁷', '7', 'g'),
          '⁸', '8', 'g'),
        '⁹', '9', 'g')
      ),
      -- Remove ALL non-alphanumeric characters (including spaces and special chars)
      '[^a-zA-Z0-9]', '', 'g'
    )
  );
END;
$$;

-- Updated find_movie_exact function with normalization
CREATE OR REPLACE FUNCTION find_movie_exact(
  search_title TEXT,
  search_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  year INTEGER,
  match_type TEXT,
  year_distance INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  normalized_search TEXT;
BEGIN
  -- Normalize the search title once
  normalized_search := normalize_title(search_title);
  
  RETURN QUERY
  WITH all_matches AS (
    -- Exact match on normalized original titles
    SELECT 
      m.id,
      m.title,
      m.year,
      'original_exact' as match_type,
      CASE 
        WHEN search_year IS NULL THEN 0
        ELSE ABS(m.year - search_year)
      END as year_distance
    FROM v3_movies m
    WHERE normalize_title(m.title) = normalized_search
    
    UNION ALL
    
    -- Exact match on normalized translated titles
    SELECT 
      m.id,
      m.title,
      m.year,
      'translation_exact' as match_type,
      CASE 
        WHEN search_year IS NULL THEN 0
        ELSE ABS(m.year - search_year)
      END as year_distance
    FROM v3_movies m
    JOIN v3_movie_translations mt ON mt.movie_id = m.id
    WHERE normalize_title(mt.title) = normalized_search
    
    UNION ALL
    
    -- Trigram similarity fallback for typos/variants (original titles)
    SELECT 
      m.id,
      m.title,
      m.year,
      'original_similarity' as match_type,
      CASE 
        WHEN search_year IS NULL THEN 0
        ELSE ABS(m.year - search_year)
      END as year_distance
    FROM v3_movies m
    WHERE similarity(normalize_title(m.title), normalized_search) > 0.75
    AND normalize_title(m.title) != normalized_search
    
    UNION ALL
    
    -- Trigram similarity fallback for typos/variants (translated titles)
    SELECT 
      m.id,
      m.title,
      m.year,
      'translation_similarity' as match_type,
      CASE 
        WHEN search_year IS NULL THEN 0
        ELSE ABS(m.year - search_year)
      END as year_distance
    FROM v3_movies m
    JOIN v3_movie_translations mt ON mt.movie_id = m.id
    WHERE similarity(normalize_title(mt.title), normalized_search) > 0.75
    AND normalize_title(mt.title) != normalized_search
  ),
  filtered_matches AS (
    SELECT DISTINCT ON (am.id) 
      am.id,
      am.title,
      am.year,
      am.match_type,
      am.year_distance
    FROM all_matches am
    WHERE 
      search_year IS NULL OR am.year_distance <= 1
    ORDER BY 
      am.id,
      CASE am.match_type
        WHEN 'original_exact' THEN 1
        WHEN 'translation_exact' THEN 2
        WHEN 'original_similarity' THEN 3
        WHEN 'translation_similarity' THEN 4
      END,
      am.year_distance
  )
  SELECT 
    fm.id,
    fm.title,
    fm.year,
    fm.match_type,
    fm.year_distance
  FROM filtered_matches fm
  ORDER BY 
    CASE fm.match_type
      WHEN 'original_exact' THEN 1
      WHEN 'translation_exact' THEN 2
      WHEN 'original_similarity' THEN 3
      WHEN 'translation_similarity' THEN 4
    END,
    fm.year_distance,
    fm.year DESC
  LIMIT 1;
END;
$$;
```

## Extension Telemetry (Anonymous Install + Query Logs)

These tables back the browser extension usage tracking implemented in
`src/app/api/extension/jumpscares/route.ts`.

```sql
-- Extension install registry (anonymous users)
create table if not exists public.v3_extension_installations (
  id bigserial primary key,
  instance_id text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  total_queries integer not null default 0
);

-- Per-request logs for market/usage insights
create table if not exists public.v3_extension_query_logs (
  id bigserial primary key,
  installation_id bigint not null references public.v3_extension_installations(id) on delete cascade,
  created_at timestamptz not null default now(),
  query_params jsonb not null,
  response_summary jsonb not null,
  status_code integer not null
);

-- Indexes
create index if not exists idx_v3_ext_logs_installation_id on public.v3_extension_query_logs (installation_id);
create index if not exists idx_v3_ext_logs_created_at on public.v3_extension_query_logs (created_at desc);
create index if not exists idx_v3_ext_logs_status_code on public.v3_extension_query_logs (status_code);

-- Optional JSONB GIN indexes
create index if not exists idx_v3_ext_logs_query_params_gin on public.v3_extension_query_logs using gin (query_params);
create index if not exists idx_v3_ext_logs_response_summary_gin on public.v3_extension_query_logs using gin (response_summary);
```

Notes:
- instance_id must be a stable anonymous ID sent by the extension in the X-Extension-Instance-ID header.
- The API increments total_queries and updates last_seen_at on every request, and writes a row to v3_extension_query_logs for all outcomes (200/400/404/429/500).
- Access uses the service role via [`supabaseAdmin`](src/lib/server-utils.ts); add RLS only if you expose these tables to non-admin clients.

## Search Logic Implementation Notes

### Extension API Year Tolerance
The extension API uses a ±1 year tolerance for matching movies:
- Movie detected as 2001 → accepts matches from 2000, 2001, 2002
- Multiple matches within tolerance → selects closest year
- Outside tolerance → match rejected

### Title Display Logic
The application always displays English titles when available, falling back to original titles:

1. Check for English translation in `v3_movie_translations` where `iso_639_1 = 'en'`
2. If found, use the English `title`
3. If not found, use the original `title` from `v3_movies`

This logic is implemented in `src/lib/server-utils.ts` in the `getDisplayTitle()` function.

### Match Priority Order (Extension)
1. **Priority 1**: Exact match on normalized original titles
2. **Priority 2**: Exact match on normalized translated titles
3. **Priority 3**: Similarity match (>0.75 threshold) on normalized original titles
4. **Priority 4**: Similarity match (>0.75 threshold) on normalized translated titles

**Normalization Examples:**
- `[REC]` → `rec`
- `[REC]²` → `rec2`
- `[REC] 2` → `rec2`
- `[REC] 3` → `rec3`
- `[•REC]³ - La genesi` → `rec3lagenesi`
- `Rec 3 - La Genesi` → `rec3lagenesi`
- All variations of REC sequels normalize consistently ✅

### Performance Considerations
- Single query approach is much more efficient than multiple sequential queries
- Year filtering happens in SQL, reducing data transfer
- DISTINCT ON prevents duplicate results while preserving priority order

## Migration Notes for Other Tech Stacks

If migrating to a different database/framework:

1. **Full-text search**: Most databases have equivalent features (MySQL FTS, MongoDB text search, Elasticsearch, etc.)
2. **Trigram matching**: Available in PostgreSQL, can be replicated with fuzzy string matching libraries
3. **JSON aggregation**: The JSONB aggregation logic would need to be handled in application code for non-PostgreSQL databases
4. **Priority-based ranking**: The UNION + ranking logic is standard SQL and should be portable

## Related Files
- `/src/app/api/search/route.ts` - Main search API endpoint
- `/src/app/api/extension/jumpscares/route.ts` - Browser extension API endpoint
- `/src/lib/server-utils.ts` - Title display logic and transformation functions
- `/src/app/api/movie/[id]/export/route.ts` - Uses display title logic for SRT filenames