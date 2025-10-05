# Database Setup Documentation

This document contains all the PostgreSQL/Supabase database setup commands required for the JumpSquare application.

## Required Extensions

```sql
-- Enable pg_trgm extension for better partial matching and typo tolerance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
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
This function provides hybrid search capabilities across both original and translated movie titles.

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

## Search Logic Implementation Notes

### Title Display Logic
The application always displays English titles when available, falling back to original titles:

1. Check for English translation in `v3_movie_translations` where `iso_639_1 = 'en'`
2. If found, use the English `title`
3. If not found, use the original `title` from `v3_movies`

This logic is implemented in `src/lib/server-utils.ts` in the `getDisplayTitle()` function.

### Search Priority Order
1. **Priority 1**: Full-text search match in original titles
2. **Priority 2**: ILIKE partial match in original titles (fallback)
3. **Priority 3**: Full-text search match in translated titles
4. **Priority 4**: ILIKE partial match in translated titles (fallback)

### Performance Considerations
- The `pg_trgm` extension enables fast partial matching and typo tolerance
- GIN indexes provide excellent performance for both trigram and full-text searches
- The hybrid approach ensures comprehensive coverage while maintaining speed
- Relevance ranking via `ts_rank()` improves result quality

## Migration Notes for Other Tech Stacks

If migrating to a different database/framework:

1. **Full-text search**: Most databases have equivalent features (MySQL FTS, MongoDB text search, Elasticsearch, etc.)
2. **Trigram matching**: Available in PostgreSQL, can be replicated with fuzzy string matching libraries
3. **JSON aggregation**: The JSONB aggregation logic would need to be handled in application code for non-PostgreSQL databases
4. **Priority-based ranking**: The UNION + ranking logic is standard SQL and should be portable

## Related Files
- `/src/app/api/search/route.ts` - Main search API endpoint
- `/src/lib/server-utils.ts` - Title display logic and transformation functions
- `/src/app/api/movie/[id]/export/route.ts` - Uses display title logic for SRT filenames