import { createFileRoute } from "@tanstack/react-router";
import { Mail, Plus } from "lucide-react";
import { members } from "@/data/mock";
import { MemberAvatar } from "@/components/mpms/Avatar";
import { ProgressBar } from "@/components/mpms/Progress";
import { Tag } from "@/components/mpms/Badges";

export const Route = createFileRoute("/admin/teams")({
  head: () => ({ meta: [{ title: "Teams — Admin" }] }),
  component: Teams,
});

function Teams() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">{members.length} members · 3 departments</p>
        </div>
        <button className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
          <Plus className="size-3.5" /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {members.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all">
            <div className="flex items-start gap-3">
              <MemberAvatar id={m.id} size={48} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{m.name}</div>
                <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><Mail className="size-3" />{m.email}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Tag tone="primary">{m.role}</Tag>
              <Tag tone="cyan">{m.department}</Tag>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-muted/60 rounded-md p-2 text-center"><div className="font-mono font-semibold text-sm">{m.tasksDone}</div><div className="text-muted-foreground text-[10px]">Tasks done</div></div>
              <div className="bg-muted/60 rounded-md p-2 text-center"><div className="font-mono font-semibold text-sm">{m.tasksOpen}</div><div className="text-muted-foreground text-[10px]">Open</div></div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Productivity</span>
                <span className="font-mono font-semibold">{m.productivity}%</span>
              </div>
              <ProgressBar value={m.productivity} tone={m.productivity > 85 ? "success" : m.productivity > 75 ? "primary" : "warning"} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.skills.map((s) => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}