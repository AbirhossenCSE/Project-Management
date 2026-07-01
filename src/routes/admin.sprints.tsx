import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Plus, Zap } from "lucide-react";
import { useMemo } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { BurndownChart, VelocityBars } from "@/components/shared/Charts";
import { useProjects, useSprints } from "@/hooks";

export const Route = createFileRoute("/admin/sprints")({
  head: () => ({ meta: [{ title: "Sprints — Admin" }] }),
  component: Sprints,
});

function Sprints() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const selectedProject = projects[0];
  const { sprints, loading: sprintsLoading, error: sprintsError } = useSprints(selectedProject?._id ?? "");

  const loading = projectsLoading || sprintsLoading;
  const error = projectsError ?? sprintsError;

  const velocityData = useMemo(
    () => sprints.map((sprint) => ({ name: sprint.name.split("—")[0].trim(), value: sprint.tasks.length })),
    [sprints],
  );

  const burndownSeries = useMemo(() => {
    const activeSprint = sprints.find((sprint) => sprint.status === "active") ?? sprints[0];
    const taskCount = activeSprint?.tasks.length ?? 0;
    return Array.from({ length: 7 }, (_value, index) => ({
      day: `D${index + 1}`,
      ideal: Math.max(taskCount - index, 0),
      actual: Math.max(taskCount - Math.round(index * 0.8), 0),
    }));
  }, [sprints]);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading sprints...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sprints</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedProject ? `${sprints.length} sprints for ${selectedProject.name}` : "No accessible project found"}</p>
        </div>
        <button className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
          <Plus className="size-3.5" /> New Sprint
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Sprint 14 Burndown</h2>
          <BurndownChart data={burndownSeries} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Team Velocity</h2>
          <VelocityBars data={velocityData} />
        </div>
      </div>

      <div className="space-y-3">
        {sprints.map((s) => {
          return (
            <div key={s._id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl grid place-items-center shadow-glow gradient-primary text-white">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground">{typeof s.project === "object" ? s.project.name : selectedProject?.name ?? "Project"} · {new Date(s.startDate).toLocaleDateString()} → {new Date(s.endDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Velocity</div>
                    <div className="font-mono font-semibold">{s.tasks.length} pts</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Points</div>
                    <div className="font-mono font-semibold">{s.tasks.length}/{Math.max(s.tasks.length, 1)}</div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${s.status === "active" ? "bg-primary/10 text-primary border-primary/20"
                    : s.status === "completed" ? "bg-success/10 text-success border-success/20"
                      : "bg-muted text-muted-foreground border-border"
                    }`}>{s.status}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Progress</span><span className="font-mono font-semibold text-foreground">{s.progress}%</span>
                </div>
                <ProgressBar value={s.progress} tone={s.status === "completed" ? "success" : "primary"} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}