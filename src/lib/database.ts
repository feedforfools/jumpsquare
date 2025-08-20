import { supabase } from "./supabase";
import { Movie, Director, Jumpscare, Genre } from "@/types";
import { MOVIES_PER_PAGE } from "@/lib/constants";

// Define the structure that Supabase returns
interface SupabaseMovieResponse {
  id: string;
  title: string;
  year: number;
  genre: string; // TODO: remove this when switching to genres array
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description?: string;
  runtime_minutes?: number;
  created_at: string;
  updated_at: string;
  v2_movie_directors: Array<{
    v2_directors: Director;
  }>;
  v2_movie_genres: Array<{
    v2_genres: Genre;
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
    .from("v2_movies")
    .select("*", { count: "exact", head: true });

  // Then get the paginated results
  const { data: movies, error } = await supabase
    .from("v2_movies")
    .select(
      `
      *,
      v2_movie_directors (
        v2_directors (
          id,
          name,
          bio
        )
      ),
      v2_movie_genres (
        v2_genres (
          id,
          name,
          description
        )
      )
    `
    )
    .order("jumpscare_count", { ascending: false })
    .order("title", { ascending: true })
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
      directors: movie.v2_movie_directors.map((md) => md.v2_directors),
      genres: movie.v2_movie_genres.map((mg) => mg.v2_genres),
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
  const titleYearFilter = `title.ilike.%${query}%,year.eq.${
    parseInt(query) || 0
  }`;

  // Get total count for search results
  const { count: totalCount } = await supabase
    .from("v2_movies")
    .select("*", { count: "exact", head: true })
    .or(titleYearFilter);

  // Get paginated search results
  const { data: movies, error } = await supabase
    .from("v2_movies")
    .select(
      `
      *,
      v2_movie_directors (
        v2_directors (
          id,
          name,
          bio
        )
      ),
      v2_movie_genres (
        v2_genres (
          id,
          name,
          description
        )
      )
    `
    )
    .or(titleYearFilter)
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
      directors: movie.v2_movie_directors.map((md) => md.v2_directors),
      genres: movie.v2_movie_genres.map((mg) => mg.v2_genres),
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
    .from("v2_movies")
    .select(
      `
      *,
      v2_movie_directors (
        v2_directors (
          id,
          name,
          bio
        )
      ),
      v2_movie_genres (
        v2_genres (
          id,
          name,
          description
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
    directors: movieData.v2_movie_directors.map((md) => md.v2_directors),
    genres: movieData.v2_movie_genres.map((mg) => mg.v2_genres),
  };
}

// Get jumpscares for a movie
export async function getJumpscaresByMovieId(
  movieId: string
): Promise<Jumpscare[]> {
  const { data: jumpscares, error } = await supabase
    .from("v2_jumpscares")
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
    .from("v2_directors")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching directors:", error);
    return [];
  }

  return directors || [];
}

// Get all genres
export async function getGenres(): Promise<Genre[]> {
  const { data: genres, error } = await supabase
    .from("v2_genres")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching genres:", error);
    return [];
  }

  return genres || [];
}

// Helper function to format timestamp
export const formatTimestamp = (minutes: number, seconds: number): string => {
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};
