import { Movie, Jumpscare, Director, MovieDirector } from "@/types";

export const mockDirectors: Director[] = [
  {
    id: "d1",
    name: "James Wan",
    bio: "Malaysian-Australian film director, screenwriter, and producer known for creating the Saw and Insidious franchises.",
  },
  {
    id: "d2",
    name: "Ari Aster",
    bio: "American film director, screenwriter, and producer known for horror films Hereditary and Midsommar.",
  },
  {
    id: "d3",
    name: "John Krasinski",
    bio: "American actor, director, producer, and screenwriter known for A Quiet Place series.",
  },
  {
    id: "d4",
    name: "Jordan Peele",
    bio: "American actor, comedian, writer, producer, and director known for socially conscious horror films.",
  },
  {
    id: "d5",
    name: "Jennifer Kent",
    bio: "Australian filmmaker known for psychological horror films The Babadook and The Nightingale.",
  },
  {
    id: "d6",
    name: "Scott Derrickson",
    bio: "American director, screenwriter and producer known for horror films Sinister and The Exorcism of Emily Rose.",
  },
  {
    id: "d7",
    name: "Gore Verbinski",
    bio: "American film director, screenwriter, producer and musician known for The Ring and Pirates of the Caribbean.",
  },
  {
    id: "d8",
    name: "Mike Flanagan",
    bio: "American filmmaker known for horror films and Netflix series including The Haunting anthology.",
  },
  {
    id: "d9",
    name: "David Gordon Green",
    bio: "American filmmaker known for independent films and the recent Halloween trilogy.",
  },
  {
    id: "d10",
    name: "Robert Eggers",
    bio: "American filmmaker known for period horror films The Witch and The Lighthouse.",
  },
  {
    id: "d11",
    name: "Leigh Whannell",
    bio: "Australian screenwriter, producer, director and actor, co-creator of the Saw franchise.",
  },
  {
    id: "d12",
    name: "Ti West",
    bio: "American filmmaker known for horror films X, Pearl, and The House of the Devil.",
  },
];

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Conjuring",
    year: 2013,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 8,
    runtime_minutes: 112,
    description:
      "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    directors: [mockDirectors.find((d) => d.id === "d1")!],
  },
  {
    id: "2",
    title: "Insidious",
    year: 2010,
    genre: "Horror",
    rating: "PG-13",
    jumpscare_count: 12,
    runtime_minutes: 103,
    description:
      "A family looks to prevent evil spirits from trapping their comatose child in a realm called The Further.",
    directors: [mockDirectors.find((d) => d.id === "d1")!],
  },
  {
    id: "3",
    title: "Hereditary",
    year: 2018,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 6,
    runtime_minutes: 127,
    description:
      "A grieving family is haunted by tragedy and disturbing secrets.",
    directors: [mockDirectors.find((d) => d.id === "d2")!],
  },
  {
    id: "4",
    title: "A Quiet Place",
    year: 2018,
    genre: "Horror/Thriller",
    rating: "PG-13",
    jumpscare_count: 9,
    runtime_minutes: 90,
    description:
      "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    directors: [mockDirectors.find((d) => d.id === "d3")!],
  },
  {
    id: "5",
    title: "Get Out",
    year: 2017,
    genre: "Horror/Thriller",
    rating: "R",
    jumpscare_count: 4,
    runtime_minutes: 104,
    description:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness becomes a nightmare.",
    directors: [mockDirectors.find((d) => d.id === "d4")!],
  },
  {
    id: "6",
    title: "The Babadook",
    year: 2014,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 7,
    runtime_minutes: 94,
    description:
      "A single mother and her son discover a sinister book that unleashes a supernatural entity.",
    directors: [mockDirectors.find((d) => d.id === "d5")!],
  },
  {
    id: "7",
    title: "Sinister",
    year: 2012,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 11,
    runtime_minutes: 110,
    description:
      "A true-crime writer finds a cache of 8mm home movies films that suggest the murder he is currently researching is the work of a serial killer.",
    directors: [mockDirectors.find((d) => d.id === "d6")!],
  },
  {
    id: "8",
    title: "The Ring",
    year: 2002,
    genre: "Horror",
    rating: "PG-13",
    jumpscare_count: 8,
    runtime_minutes: 115,
    description:
      "A journalist must investigate a mysterious videotape which seems to cause the death of anyone one week to the day after they view it.",
    directors: [mockDirectors.find((d) => d.id === "d7")!],
  },
  {
    id: "9",
    title: "Us",
    year: 2019,
    genre: "Horror/Thriller",
    rating: "R",
    jumpscare_count: 7,
    runtime_minutes: 116,
    description:
      "A family's serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.",
    directors: [mockDirectors.find((d) => d.id === "d4")!],
  },
  {
    id: "10",
    title: "The Witch",
    year: 2015,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 5,
    runtime_minutes: 92,
    description:
      "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.",
    directors: [mockDirectors.find((d) => d.id === "d10")!],
  },
  {
    id: "11",
    title: "Halloween",
    year: 2018,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 13,
    runtime_minutes: 106,
    description:
      "Laurie Strode confronts her long-time foe Michael Myers, the masked figure who has haunted her since she narrowly escaped his killing spree.",
    directors: [mockDirectors.find((d) => d.id === "d9")!],
  },
  {
    id: "12",
    title: "X",
    year: 2022,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 9,
    runtime_minutes: 105,
    description:
      "In 1979, a group of young filmmakers set out to make an adult film in rural Texas, but when their reclusive, elderly hosts catch them in the act, the cast find themselves fighting for their lives.",
    directors: [mockDirectors.find((d) => d.id === "d12")!],
  },
  {
    id: "13",
    title: "The Invisible Man",
    year: 2020,
    genre: "Horror/Thriller",
    rating: "R",
    jumpscare_count: 8,
    runtime_minutes: 124,
    description:
      "When Cecilia's abusive ex takes his own life and leaves her his fortune, she suspects his death was a hoax.",
    directors: [mockDirectors.find((d) => d.id === "d11")!],
  },
  {
    id: "14",
    title: "Midsommar",
    year: 2019,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 3,
    runtime_minutes: 148,
    description:
      "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival.",
    directors: [mockDirectors.find((d) => d.id === "d2")!],
  },
  {
    id: "15",
    title: "Doctor Sleep",
    year: 2019,
    genre: "Horror",
    rating: "R",
    jumpscare_count: 6,
    runtime_minutes: 152,
    description:
      "Years following the events of The Shining, a now-adult Dan Torrance meets a young girl with similar powers.",
    directors: [mockDirectors.find((d) => d.id === "d8")!],
  },
];

export const mockMovieDirectors: MovieDirector[] = [
  { id: "md1", movie_id: "1", director_id: "d1" },
  { id: "md2", movie_id: "2", director_id: "d1" },
  { id: "md3", movie_id: "3", director_id: "d2" },
  { id: "md4", movie_id: "4", director_id: "d3" },
  { id: "md5", movie_id: "5", director_id: "d4" },
  { id: "md6", movie_id: "6", director_id: "d5" },
  { id: "md7", movie_id: "7", director_id: "d6" },
  { id: "md8", movie_id: "8", director_id: "d7" },
  { id: "md9", movie_id: "9", director_id: "d4" },
  { id: "md10", movie_id: "10", director_id: "d10" },
  { id: "md11", movie_id: "11", director_id: "d9" },
  { id: "md12", movie_id: "12", director_id: "d12" },
  { id: "md13", movie_id: "13", director_id: "d11" },
  { id: "md14", movie_id: "14", director_id: "d2" },
  { id: "md15", movie_id: "15", director_id: "d8" },
];

export const mockJumpscares: Jumpscare[] = [
  // The Conjuring jumpscares
  {
    id: "1",
    movie_id: "1",
    timestamp_minutes: 8,
    timestamp_seconds: 30,
    intensity: 6,
    description: "Basement door slams shut",
    category: "minor",
  },
  {
    id: "2",
    movie_id: "1",
    timestamp_minutes: 23,
    timestamp_seconds: 15,
    intensity: 8,
    description: "Hands clapping behind Carolyn",
    category: "major",
  },
  {
    id: "3",
    movie_id: "1",
    timestamp_minutes: 45,
    timestamp_seconds: 42,
    intensity: 9,
    description: "Bathsheba appears in mirror",
    category: "major",
  },
  {
    id: "4",
    movie_id: "1",
    timestamp_minutes: 67,
    timestamp_seconds: 20,
    intensity: 7,
    description: "Wardrobe falls over",
    category: "minor",
  },

  // Insidious jumpscares
  {
    id: "5",
    movie_id: "2",
    timestamp_minutes: 12,
    timestamp_seconds: 5,
    intensity: 7,
    description: "Face at the window",
    category: "major",
  },
  {
    id: "6",
    movie_id: "2",
    timestamp_minutes: 34,
    timestamp_seconds: 18,
    intensity: 9,
    description: "Red-faced demon behind Josh",
    category: "major",
  },
  {
    id: "7",
    movie_id: "2",
    timestamp_minutes: 56,
    timestamp_seconds: 30,
    intensity: 8,
    description: "Tiny Tim dancing in The Further",
    category: "major",
  },

  // Hereditary jumpscares
  {
    id: "8",
    movie_id: "3",
    timestamp_minutes: 43,
    timestamp_seconds: 12,
    intensity: 10,
    description: "Car accident aftermath",
    category: "major",
  },
  {
    id: "9",
    movie_id: "3",
    timestamp_minutes: 89,
    timestamp_seconds: 45,
    intensity: 8,
    description: "Charlie's clicking tongue",
    category: "major",
  },

  // A Quiet Place jumpscares
  {
    id: "10",
    movie_id: "4",
    timestamp_minutes: 15,
    timestamp_seconds: 45,
    intensity: 10,
    description: "Creature attacks at the bridge",
    category: "major",
  },
  {
    id: "11",
    movie_id: "4",
    timestamp_minutes: 78,
    timestamp_seconds: 12,
    intensity: 9,
    description: "Basement flooding scene",
    category: "major",
  },

  // Get Out jumpscares
  {
    id: "12",
    movie_id: "5",
    timestamp_minutes: 67,
    timestamp_seconds: 30,
    intensity: 7,
    description: "Georgina's flash photograph",
    category: "major",
  },

  // The Babadook jumpscares
  {
    id: "13",
    movie_id: "6",
    timestamp_minutes: 34,
    timestamp_seconds: 22,
    intensity: 8,
    description: "Babadook appears in book",
    category: "major",
  },
  {
    id: "14",
    movie_id: "6",
    timestamp_minutes: 71,
    timestamp_seconds: 15,
    intensity: 9,
    description: "Babadook on ceiling",
    category: "major",
  },

  // Sinister jumpscares
  {
    id: "15",
    movie_id: "7",
    timestamp_minutes: 28,
    timestamp_seconds: 40,
    intensity: 8,
    description: "Lawn mower accident footage",
    category: "major",
  },
  {
    id: "16",
    movie_id: "7",
    timestamp_minutes: 67,
    timestamp_seconds: 10,
    intensity: 10,
    description: "Bughuul appears behind Ellison",
    category: "major",
  },

  // The Ring jumpscares
  {
    id: "17",
    movie_id: "8",
    timestamp_minutes: 45,
    timestamp_seconds: 30,
    intensity: 9,
    description: "Samara crawls out of TV",
    category: "major",
  },
  {
    id: "18",
    movie_id: "8",
    timestamp_minutes: 89,
    timestamp_seconds: 12,
    intensity: 8,
    description: "Well scene revelation",
    category: "major",
  },

  // Us jumpscares
  {
    id: "19",
    movie_id: "9",
    timestamp_minutes: 34,
    timestamp_seconds: 20,
    intensity: 9,
    description: "Doppelgängers first appearance",
    category: "major",
  },

  // The Witch jumpscares
  {
    id: "20",
    movie_id: "10",
    timestamp_minutes: 23,
    timestamp_seconds: 45,
    intensity: 7,
    description: "Peek-a-boo with baby Samuel",
    category: "major",
  },

  // Halloween jumpscares
  {
    id: "21",
    movie_id: "11",
    timestamp_minutes: 45,
    timestamp_seconds: 15,
    intensity: 8,
    description: "Michael appears in closet",
    category: "major",
  },
  {
    id: "22",
    movie_id: "11",
    timestamp_minutes: 78,
    timestamp_seconds: 30,
    intensity: 9,
    description: "Kitchen island attack",
    category: "major",
  },

  // X jumpscares
  {
    id: "23",
    movie_id: "12",
    timestamp_minutes: 56,
    timestamp_seconds: 22,
    intensity: 8,
    description: "Pearl in the basement",
    category: "major",
  },

  // The Invisible Man jumpscares
  {
    id: "24",
    movie_id: "13",
    timestamp_minutes: 34,
    timestamp_seconds: 10,
    intensity: 8,
    description: "Kitchen knife flies",
    category: "major",
  },
  {
    id: "25",
    movie_id: "13",
    timestamp_minutes: 67,
    timestamp_seconds: 45,
    intensity: 9,
    description: "Restaurant attack",
    category: "major",
  },
];

// Helper function to get jumpscares for a specific movie
export const getJumpscaresByMovieId = (movieId: string): Jumpscare[] => {
  return mockJumpscares.filter((js) => js.movie_id === movieId);
};

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

// Helper function to get directors by movie id
export const getDirectorsByMovieId = (movieId: string): Director[] => {
  const movieDirectorRelations = mockMovieDirectors.filter(
    (md) => md.movie_id === movieId
  );
  return movieDirectorRelations
    .map((md) => mockDirectors.find((d) => d.id === md.director_id))
    .filter(Boolean) as Director[];
};
