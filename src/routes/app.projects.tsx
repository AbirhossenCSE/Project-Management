import { createFileRoute, Link } from "@tanstack/react-router";
import { projects, tasks } from "@/data/mock";
import { ProgressBar } from "@/components/mpms/Progress";
import { StatusBadge } from "@/components/mpms/Badges";
import { AvatarGroup } from "@/components/mpms/Avatar";

export const Route = createFileRoute("/app/projects")({
  component: () => {
    const mine = projects.filter((p) => p.team.includes("m2") || tasks.some(t => t.projectId === p.id && t.assignee === "m2"));
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Projects you're contributing to</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mine.map((p) => (
            <Link key={p.id} to="/admin/projects/$projectId" params={{ projectId: p.id }} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold" style={{ background: p.color }}>
                  {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="font-semibold mb-1">{p.name}</div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
              <ProgressBar value={p.progress} className="mb-3" />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <AvatarGroup ids={p.team} size={22} />
                <span className="font-mono">{p.progress}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  },
});