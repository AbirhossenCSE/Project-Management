import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { getMe } from "@/services/auth.service";
import { useProjects, useSprints } from "@/hooks";

export const Route = createFileRoute("/app/sprints")({
  component: Sprints,
});

function Sprints() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserError, setCurrentUserError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    void getMe()
      .then((response) => {
        if (!mounted) return;
        setCurrentUserId(response.data.user.id);
      })
      .catch((err) => {
        if (!mounted) return;
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load your profile";
        setCurrentUserError(message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const memberProject = useMemo(() => projects.find((project) => project.owner._id === currentUserId || project.members.some((member) => member._id === currentUserId)), [projects, currentUserId]);
  const { sprints, loading: sprintsLoading, error: sprintsError } = useSprints(memberProject?._id ?? "");

  const loading = projectsLoading || sprintsLoading || !currentUserId;
  const error = projectsError ?? sprintsError ?? currentUserError;
  const activeSprints = sprints.filter((sprint) => sprint.status === "active");

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading sprints...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sprints</h1>
        <p className="text-sm text-muted-foreground mt-1">{memberProject ? `Sprints you're contributing to in ${memberProject.name}` : "No accessible project found"}</p>
      </div>
      <div className="space-y-3">
        {activeSprints.map((sprint) => (
          <details key={sprint._id} className="bg-card border border-border rounded-2xl shadow-soft group" open>
            <summary className="p-5 cursor-pointer flex items-center gap-4 list-none flex-wrap">
              <div className="size-10 rounded-xl grid place-items-center gradient-primary text-white shadow-glow"><Zap className="size-4" /></div>
              <div className="flex-1 min-w-[180px]">
                <div className="font-medium">{sprint.name}</div>
                <div className="text-[11px] text-muted-foreground">{typeof sprint.project === "object" ? sprint.project.name : memberProject?.name ?? "Project"} · {new Date(sprint.startDate).toLocaleDateString()} → {new Date(sprint.endDate).toLocaleDateString()}</div>
              </div>
              <div className="w-40"><ProgressBar value={Math.min(100, Math.round((sprint.tasks.length / Math.max(sprint.tasks.length, 1)) * 100))} /></div>
              <span className="text-xs font-mono font-semibold">100%</span>
            </summary>
            <div className="border-t border-border p-5 grid grid-cols-3 gap-4 text-xs">
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Velocity</div><div className="font-mono font-semibold text-sm mt-1">{sprint.tasks.length} pts</div></div>
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Completed</div><div className="font-mono font-semibold text-sm mt-1">{sprint.tasks.length}/{Math.max(sprint.tasks.length, 1)}</div></div>
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Days left</div><div className="font-mono font-semibold text-sm mt-1">{Math.max(0, Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}</div></div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}