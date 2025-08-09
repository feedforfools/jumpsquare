export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Jumpscare {
  id: string;
  movie_id: string;
  timestamp_minutes: number;
  timestamp_seconds: number;
  timestamp_millis: number;
  intensity: number; // 1-10
  description: string;
  category: "major" | "minor" | "false_alarm";
  created_at: string;
  updated_at: string;
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
