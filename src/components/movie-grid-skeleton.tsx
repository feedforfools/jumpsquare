import { MovieCardSkeleton } from "@/components/movie-card-skeleton";

interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 12 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[700px] md:min-h-[550px] lg:min-h-[400px] content-start">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}
