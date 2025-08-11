import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Section - Two column layout on large screens */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
        {/* Left side - Movie info area */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <Skeleton className="h-10 w-2/3" />

          {/* Metadata */}
          <div className="flex gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Director */}
          <Skeleton className="h-5 w-48" />

          {/* Description area */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Right side - Stats card area */}
        <div className="lg:w-80">
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
      </div>

      {/* Jumpscare Timeline Section */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        {/* Table area - simple representation */}
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
