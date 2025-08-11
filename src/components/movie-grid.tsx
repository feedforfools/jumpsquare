import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[900px] md:min-h-[750px] lg:min-h-[650px]">
        <p className="text-gray-600">
          No movies found. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Grid container with responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[700px] md:min-h-[550px] lg:min-h-[400px] content-start">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
