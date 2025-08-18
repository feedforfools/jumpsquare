export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string; // TODO: remove this when switching to genres array
  genres?: Genre[];
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description?: string;
  runtime_minutes?: number;
  directors?: Director[];
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
}

export interface Director {
  id: string;
  name: string;
  bio?: string;
}

export interface MovieDirector {
  id: string;
  movie_id: string;
  director_id: string;
}

export interface MovieGenre {
  id: string;
  movie_id: string;
  genre_id: string;
}

export interface Jumpscare {
  id: string;
  movie_id: string;
  timestamp_minutes: number;
  timestamp_seconds: number;
  intensity: number; // 1-10
  description: string;
  category: "major" | "minor" | "false_alarm";
}

export function formatTimestamp(minutes: number, seconds: number): string {
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
}
