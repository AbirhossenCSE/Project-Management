import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted/60", className)}
      {...props}
    />
  );
}

export function ProjectGridSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 bg-primary/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="border border-border rounded-2xl p-5 bg-card/50 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="pt-2 flex justify-between items-center border-t border-border/50">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TaskTableSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28 bg-primary/20" />
      </div>
      <div className="border border-border rounded-2xl overflow-hidden bg-card/30">
        <div className="p-4 border-b border-border/50 flex gap-4 bg-muted/20">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="p-4 border-b border-border/40 flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="border border-border rounded-2xl p-5 bg-card/50 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-2xl p-5 bg-card/50 h-80">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-full w-full rounded" />
        </div>
        <div className="border border-border rounded-2xl p-5 bg-card/50 h-80">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-full w-full rounded" />
        </div>
      </div>
    </div>
  );
}
