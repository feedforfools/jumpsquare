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

// Helper function to transform movie data for card displays
export const transformMovieForCard = (movie: any) => {
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
      movie.v2_movie_directors?.slice(0, 2).map((md: any) => md.v2_directors) ||
      [],
    genres:
      movie.v2_movie_genres?.slice(0, 2).map((mg: any) => mg.v2_genres) || [],
  };
};
