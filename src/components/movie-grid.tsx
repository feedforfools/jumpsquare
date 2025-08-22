import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOVIES_PER_PAGE } from "@/lib/constants";

interface MovieGridProps {
  movies: Movie[];
}

// Invisible placeholder component that matches MovieCard's dimensions
function PlaceholderCard() {
  return (
    <Card className="invisible pointer-events-none h-full">
      <CardHeader>
        {/* Mimics the title and metadata area */}
        <div className="h-6 mb-2"></div>
        <div className="h-4 mb-1"></div>
        <div className="h-4"></div>
      </CardHeader>
      <CardContent>
        {/* Mimics the jumpscare count and description area */}
        <div className="h-6 mb-3"></div>
        <div className="h-8"></div>
      </CardContent>
    </Card>
  );
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-app-text-secondary">
          No movies found. Try a different search term.
        </p>
      </div>
    );
  }

  // Calculate how many placeholders we need to always have MOVIES_PER_PAGE items in the grid
  const placeholderCount = Math.max(0, MOVIES_PER_PAGE - movies.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Render actual movie cards */}
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {/* Add invisible placeholders only on desktop (xl and above) */}
      {/* This maintains consistent pagination position on larger screens */}
      {/* On mobile/tablet, these are hidden so pagination follows content */}
      {placeholderCount > 0 &&
        Array.from({ length: placeholderCount }, (_, index) => (
          <div
            key={`placeholder-${index}`}
            className="hidden xl:block"
            aria-hidden="true"
          >
            <PlaceholderCard />
          </div>
        ))}
    </div>
  );
}
