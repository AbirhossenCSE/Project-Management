import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/activity")({
  component: () => (
    <div className="p-6 sm:p-8 space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Everything happening across your projects</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
        <div className="text-sm text-muted-foreground">No activity yet</div>
      </div>
    </div>
  ),
});