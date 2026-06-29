import { createFileRoute } from "@tanstack/react-router";
import { sprints, findProject } from "@/data/mock";
import { ProgressBar } from "@/components/shared/Progress";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/app/sprints")({
  component: () => (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sprints</h1>
        <p className="text-sm text-muted-foreground mt-1">Sprints you're contributing to</p>
      </div>
      <div className="space-y-3">
        {sprints.filter(s => s.status === "active").map((s) => (
          <details key={s.id} className="bg-card border border-border rounded-2xl shadow-soft group" open>
            <summary className="p-5 cursor-pointer flex items-center gap-4 list-none flex-wrap">
              <div className="size-10 rounded-xl grid place-items-center gradient-primary text-white shadow-glow"><Zap className="size-4" /></div>
              <div className="flex-1 min-w-[180px]">
                <div className="font-medium">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{findProject(s.projectId)?.name} · {s.start} → {s.end}</div>
              </div>
              <div className="w-40"><ProgressBar value={s.progress} /></div>
              <span className="text-xs font-mono font-semibold">{s.progress}%</span>
            </summary>
            <div className="border-t border-border p-5 grid grid-cols-3 gap-4 text-xs">
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Velocity</div><div className="font-mono font-semibold text-sm mt-1">{s.velocity} pts</div></div>
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Completed</div><div className="font-mono font-semibold text-sm mt-1">{s.completedPoints}/{s.totalPoints}</div></div>
              <div><div className="text-muted-foreground text-[10px] uppercase font-semibold">Days left</div><div className="font-mono font-semibold text-sm mt-1">3</div></div>
            </div>
          </details>
        ))}
      </div>
    </div>
  ),
});