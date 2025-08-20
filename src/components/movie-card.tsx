import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types";
import { Clock, Zap, User } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const getIntensityColor = (count: number) => {
    if (count <= 3) return "bg-green-100 text-green-800";
    if (count <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getIntensityLabel = (count: number) => {
    if (count <= 3) return "Mild";
    if (count <= 7) return "Moderate";
    return "Intense";
  };

  // Get genre display text
  const getGenreDisplay = () => {
    if (movie.genres && movie.genres.length > 0) {
      // For card display, show primary genre (first one) or up to 2 genres
      const genreNames = movie.genres.map((g) => g.name);
      if (genreNames.length === 1) {
        return genreNames[0];
      } else if (genreNames.length === 2) {
        return genreNames.join(", ");
      } else {
        return `${genreNames[0]}, +${genreNames.length - 1}`;
      }
    }
    return movie.genre || "Horror";
  };

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1 pr-2">
                <span
                  className="block truncate text-lg leading-tight"
                  title={movie.title}
                >
                  {movie.title}
                </span>
              </div>
              <Badge variant="outline" className="ml-2 text-xs flex-shrink-0">
                {movie.rating}
              </Badge>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{getGenreDisplay()}</span>
            {movie.runtime_minutes && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{movie.runtime_minutes}m</span>
                </div>
              </>
            )}
          </div>
          {movie.directors && movie.directors.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <User className="h-3 w-3" />
              <span>{movie.directors.map((d) => d.name).join(", ")}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {movie.jumpscare_count} jumpscares
              </span>
            </div>
            <Badge className={getIntensityColor(movie.jumpscare_count)}>
              {getIntensityLabel(movie.jumpscare_count)}
            </Badge>
          </div>
          {movie.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {movie.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
