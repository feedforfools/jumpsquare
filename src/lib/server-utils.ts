import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const redis = Redis.fromEnv();

// Discover rate limiter
export const discoverRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit_jumpsquare_discover",
});

// Search rate limiter
export const searchRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(8, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit_jumpsquare_search",
});

// Detail rate limiter for individual movie pages
export const detailRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit_jumpsquare_detail",
});

// Export SRT rate limiter
export const exportRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit_jumpsquare_export",
});

// Define types for the database relations
interface MovieDirectorRelation {
  v3_directors: {
    id: string;
    name: string;
    bio?: string;
  };
}

interface MovieGenreRelation {
  v3_genres: {
    id: string;
    name: string;
  };
}

interface MovieWithRelations {
  id: string;
  title: string;
  year: number;
  rating: string;
  jumpscare_count: number;
  runtime_minutes: number;
  description: string;
  v3_movie_directors?: MovieDirectorRelation[];
  v3_movie_genres?: MovieGenreRelation[];
}

// Helper function to transform movie data for card displays
export const transformMovieForCard = (movie: MovieWithRelations | null) => {
  if (!movie) return null;
  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    rating: movie.rating,
    jumpscare_count: movie.jumpscare_count,
    runtime_minutes: movie.runtime_minutes,
    description: movie.description,
    directors:
      movie.v3_movie_directors
        ?.slice(0, 2)
        .map((md: MovieDirectorRelation) => md.v3_directors) || [],
    genres:
      movie.v3_movie_genres
        ?.slice(0, 2)
        .map((mg: MovieGenreRelation) => mg.v3_genres) || [],
  };
};
