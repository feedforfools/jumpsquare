import { Skeleton } from "@/components/ui/skeleton";

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous button skeleton */}
      <Skeleton className="h-8 w-20 rounded" />

      {/* Page number buttons skeleton */}
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-8 rounded" />
        ))}
      </div>

      {/* Next button skeleton */}
      <Skeleton className="h-8 w-16 rounded" />
    </div>
  );
}
