import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Main content block - represents the card */}
      <Skeleton className="h-[220px] w-full rounded-lg" />
    </div>
  );
}
