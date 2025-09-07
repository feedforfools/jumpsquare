import { Movie } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get genre display text => TODO: show multiple genres?
export const getGenreDisplay = (movie: Movie) => {
  if (movie.genres && movie.genres.length > 0) {
    return movie.genres[0].name;
  }
  return movie.genre || "?";
};
