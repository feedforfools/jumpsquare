import { supabase } from "./supabase";
import { Movie, Director, Jumpscare } from "@/types";
import { MOVIES_PER_PAGE } from "@/lib/constants";

// Define the structure that Supabase returns
interface SupabaseMovieResponse {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description?: string;
  runtime_minutes?: number;
  created_at: string;
  updated_at: string;
  movie_directors: Array<{
    directors: Director;
  }>;
}

export interface PaginatedMoviesResponse {
  movies: Movie[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

// Get paginated movies with directors
export async function getMovies(
  page: number = 1
): Promise<PaginatedMoviesResponse> {
  const from = (page - 1) * MOVIES_PER_PAGE;
  const to = from + MOVIES_PER_PAGE - 1;

  // First, get the total count
  const { count: totalCount } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true });

  // Then get the paginated results
  const { data: movies, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_directors (
        directors (
          id,
          name,
          bio
        )
      )
    `
    )
    .order("title")
    .range(from, to);

  if (error) {
    console.error("Error fetching movies:", error);
    return {
      movies: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasMore: false,
    };
  }

  const transformedMovies = (movies as SupabaseMovieResponse[]).map(
    (movie) => ({
      ...movie,
      directors: movie.movie_directors.map((md) => md.directors),
    })
  );

  const totalPages = Math.ceil((totalCount || 0) / MOVIES_PER_PAGE);

  return {
    movies: transformedMovies,
    totalCount: totalCount || 0,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
  };
}

// Search movies with pagination
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<PaginatedMoviesResponse> {
  if (!query.trim()) {
    return getMovies(page);
  }

  const from = (page - 1) * MOVIES_PER_PAGE;
  const to = from + MOVIES_PER_PAGE - 1;

  // Build the filter
  const filter = `title.ilike.%${query}%,genre.ilike.%${query}%,year.eq.${
    parseInt(query) || 0
  }`;

  // Get total count for search results
  const { count: totalCount } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true })
    .or(filter);

  // Get paginated search results
  const { data: movies, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_directors (
        directors (
          id,
          name,
          bio
        )
      )
    `
    )
    .or(filter)
    .order("title")
    .range(from, to);

  if (error) {
    console.error("Error searching movies:", error);
    return {
      movies: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasMore: false,
    };
  }

  const transformedMovies = (movies as SupabaseMovieResponse[]).map(
    (movie) => ({
      ...movie,
      directors: movie.movie_directors.map((md) => md.directors),
    })
  );

  const totalPages = Math.ceil((totalCount || 0) / MOVIES_PER_PAGE);

  return {
    movies: transformedMovies,
    totalCount: totalCount || 0,
    currentPage: page,
    totalPages,
    hasMore: page < totalPages,
  };
}

// Get single movie by ID
export async function getMovieById(id: string): Promise<Movie | null> {
  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_directors (
        directors (
          id,
          name,
          bio
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching movie:", error);
    return null;
  }

  const movieData = movie as SupabaseMovieResponse;

  return {
    ...movieData,
    directors: movieData.movie_directors.map((md) => md.directors),
  };
}

// Get jumpscares for a movie
export async function getJumpscaresByMovieId(
  movieId: string
): Promise<Jumpscare[]> {
  const { data: jumpscares, error } = await supabase
    .from("jumpscares")
    .select("*")
    .eq("movie_id", movieId)
    .order("timestamp_minutes", { ascending: true })
    .order("timestamp_seconds", { ascending: true });

  if (error) {
    console.error("Error fetching jumpscares:", error);
    return [];
  }

  return jumpscares || [];
}

// Get all directors
export async function getDirectors(): Promise<Director[]> {
  const { data: directors, error } = await supabase
    .from("directors")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching directors:", error);
    return [];
  }

  return directors || [];
}

// Helper function to format timestamp with milliseconds
export const formatTimestamp = (
  minutes: number,
  seconds: number,
  millis: number = 0
): string => {
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (millis > 0) {
    const formattedMillis = millis.toString().padStart(3, "0");
    return `${formattedMinutes}:${formattedSeconds}.${formattedMillis}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
};
