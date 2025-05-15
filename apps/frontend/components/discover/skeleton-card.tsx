import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Skeleton className="aspect-[9/16] rounded-lg w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}
