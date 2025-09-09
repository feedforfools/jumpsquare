import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types";
import { Clock, Zap, User } from "lucide-react";
import { getGenreDisplay } from "@/lib/utils";
import { getJumpscareIntensity } from "@/lib/jumpscare-utils";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const intensity = getJumpscareIntensity(movie.jumpscare_count);

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="transition-transform cursor-pointer h-full hover:-translate-x-1 hover:-translate-y-1">
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
              <Badge variant="neutral" className="ml-2 text-xs flex-shrink-0">
                {movie.rating}
              </Badge>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-app-text-secondary">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{getGenreDisplay(movie)}</span>
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
            <div className="flex items-center space-x-1 text-sm text-app-text-secondary">
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
                {movie.jumpscare_count}{" "}
                {movie.jumpscare_count === 1 ? "jumpscare" : "jumpscares"}
              </span>
            </div>
            <Badge className={intensity.colorClasses}>{intensity.label}</Badge>
          </div>
          {movie.description && (
            <p className="text-sm text-app-text-secondary line-clamp-2">
              {movie.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
