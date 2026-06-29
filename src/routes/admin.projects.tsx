import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutGrid, List, Plus, Search, Filter, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { projects } from "@/data/mock";
import { ProgressBar } from "@/components/mpms/Progress";
import { StatusBadge } from "@/components/mpms/Badges";
import { AvatarGroup } from "@/components/mpms/Avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }] }),
  component: Projects,
});

function Projects() {
  const [view, setView] = useState<"grid" | "table">("grid");

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects · 6 clients · $1.05M committed</p>
        </div>
        <button className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2">
          <Plus className="size-3.5" /> Create Project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-xl p-2 shadow-soft">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input placeholder="Search projects..." className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs outline-none" />
        </div>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted">
          <Filter className="size-3.5" /> Status
        </button>
        <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted">
          <Filter className="size-3.5" /> Client
        </button>
        <div className="bg-muted rounded-md p-0.5 flex">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded", view === "grid" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <LayoutGrid className="size-3.5" />
          </button>
          <button onClick={() => setView("table")} className={cn("p-1.5 rounded", view === "table" ? "bg-card shadow-soft text-primary" : "text-muted-foreground")}>
            <List className="size-3.5" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              to="/admin/projects/$projectId"
              params={{ projectId: p.id }}
              className="group bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold" style={{ background: p.color }}>
                  {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>Progress</span><span className="font-mono font-semibold text-foreground">{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} tone={p.status === "delayed" ? "destructive" : p.status === "completed" ? "success" : "primary"} className="mb-4" />
              <div className="flex items-center justify-between">
                <AvatarGroup ids={p.team} size={22} />
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{p.dueDate.split(",")[0]}</span>
                  <span className="inline-flex items-center gap-1"><DollarSign className="size-3" />{(p.budget/1000).toFixed(0)}k</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Project</th>
                <th className="text-left px-5 py-3 font-semibold">Client</th>
                <th className="text-left px-5 py-3 font-semibold">Progress</th>
                <th className="text-left px-5 py-3 font-semibold">Team</th>
                <th className="text-left px-5 py-3 font-semibold">Budget</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to="/admin/projects/$projectId" params={{ projectId: p.id }} className="flex items-center gap-3">
                      <div className="size-8 rounded-lg grid place-items-center text-white text-[10px] font-bold" style={{ background: p.color }}>
                        {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{p.client}</td>
                  <td className="px-5 py-3.5"><div className="w-28"><ProgressBar value={p.progress} /></div></td>
                  <td className="px-5 py-3.5"><AvatarGroup ids={p.team} size={22} /></td>
                  <td className="px-5 py-3.5 font-mono text-xs">${(p.spent/1000).toFixed(0)}k / ${(p.budget/1000).toFixed(0)}k</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">{p.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}