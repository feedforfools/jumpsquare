export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description?: string;
  runtime_minutes?: number;
  directors?: Director[]; // populated from join
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

export interface Jumpscare {
  id: string;
  movie_id: string;
  timestamp_minutes: number;
  timestamp_seconds: number;
  timestamp_millis: number; // 0-999 milliseconds
  intensity: number; // 1-10
  description: string;
  category: "major" | "minor" | "false_alarm";
}

export function formatTimestamp(
  minutes: number,
  seconds: number,
  millis: number
): string {
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMillis = String(millis).padStart(3, "0");
  return `${paddedMinutes}:${paddedSeconds}:${paddedMillis}`;
}
