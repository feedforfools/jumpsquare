import { supabase } from "./supabase";
import { Movie, Director, Jumpscare } from "@/types";

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

// Get all movies with directors
export async function getMovies(): Promise<Movie[]> {
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
    .order("title");

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }

  // Transform the data to match our Movie type
  return (movies as SupabaseMovieResponse[]).map((movie) => ({
    ...movie,
    directors: movie.movie_directors.map((md) => md.directors),
  }));
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) {
    return getMovies();
  }

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
    .or(
      `title.ilike.%${query}%,genre.ilike.%${query}%,year.eq.${
        parseInt(query) || 0
      }`
    )
    .order("title");

  if (error) {
    console.error("Error searching movies:", error);
    return [];
  }

  return (movies as SupabaseMovieResponse[]).map((movie) => ({
    ...movie,
    directors: movie.movie_directors.map((md) => md.directors),
  }));
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
