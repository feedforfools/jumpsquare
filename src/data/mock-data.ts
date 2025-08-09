import { Movie, Jumpscare } from "@/types";

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Conjuring",
    year: 2013,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 8,
    description:
      "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Insidious",
    year: 2010,
    genre: "Horror",
    rating: "PG-13",
    jumpscare_count: 12,
    description:
      "A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Hereditary",
    year: 2018,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 6,
    description:
      "A grieving family is haunted by tragedy and disturbing secrets.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "A Quiet Place",
    year: 2018,
    genre: "Horror/Thriller",
    rating: "PG-13",
    jumpscare_count: 9,
    description:
      "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Get Out",
    year: 2017,
    genre: "Horror/Thriller",
    rating: "R",
    jumpscare_count: 4,
    description:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness becomes a nightmare.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "The Babadook",
    year: 2014,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 7,
    description:
      "A single mother and her son discover a sinister book that unleashes a supernatural entity.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Sinister",
    year: 2012,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 11,
    description:
      "A true-crime writer finds a cache of 8mm home movies films that suggest the murder he is currently researching is the work of a serial killer.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "The Ring",
    year: 2002,
    genre: "Horror",
    rating: "PG-13",
    jumpscare_count: 8,
    description:
      "A journalist must investigate a mysterious videotape which seems to cause the death of anyone one week to the day after they view it.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockJumpscares: Jumpscare[] = [
  // The Conjuring jumpscares
  {
    id: "1",
    movie_id: "1",
    timestamp_minutes: 8,
    timestamp_seconds: 30,
    timestamp_millis: 0,
    intensity: 6,
    description: "Basement door slams shut",
    category: "minor",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    movie_id: "1",
    timestamp_minutes: 23,
    timestamp_seconds: 15,
    timestamp_millis: 0,
    intensity: 8,
    description: "Hands clapping behind Carolyn",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    movie_id: "1",
    timestamp_minutes: 45,
    timestamp_seconds: 42,
    timestamp_millis: 0,
    intensity: 9,
    description: "Bathsheba appears in mirror",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    movie_id: "1",
    timestamp_minutes: 67,
    timestamp_seconds: 20,
    timestamp_millis: 0,
    intensity: 7,
    description: "Wardrobe falls over",
    category: "minor",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Insidious jumpscares
  {
    id: "5",
    movie_id: "2",
    timestamp_minutes: 12,
    timestamp_seconds: 5,
    timestamp_millis: 0,
    intensity: 7,
    description: "Face at the window",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    movie_id: "2",
    timestamp_minutes: 34,
    timestamp_seconds: 18,
    timestamp_millis: 0,
    intensity: 9,
    description: "Red-faced demon behind Josh",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    movie_id: "2",
    timestamp_minutes: 56,
    timestamp_seconds: 30,
    timestamp_millis: 0,
    intensity: 8,
    description: "Tiny Tim dancing in The Further",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // A Quiet Place jumpscares
  {
    id: "8",
    movie_id: "4",
    timestamp_minutes: 15,
    timestamp_seconds: 45,
    timestamp_millis: 0,
    intensity: 10,
    description: "Creature attacks at the bridge",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    movie_id: "4",
    timestamp_minutes: 78,
    timestamp_seconds: 12,
    timestamp_millis: 0,
    intensity: 9,
    description: "Basement flooding scene",
    category: "major",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper function to get jumpscares for a specific movie
export const getJumpscaresByMovieId = (movieId: string): Jumpscare[] => {
  return mockJumpscares.filter((js) => js.movie_id === movieId);
};

// Helper function to format timestamp
export const formatTimestamp = (minutes: number, seconds: number): string => {
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};
