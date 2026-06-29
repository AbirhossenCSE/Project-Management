import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, DollarSign, Users, Activity as ActivityIcon, FolderOpen, Zap } from "lucide-react";
import { useState } from "react";
import { findMember, findProject, sprints, tasks as allTasks, activities } from "@/data/mock";
import { StatusBadge } from "@/components/mpms/Badges";
import { ProgressBar, ProgressRing } from "@/components/mpms/Progress";
import { AvatarGroup, MemberAvatar } from "@/components/mpms/Avatar";
import { BurndownChart } from "@/components/mpms/Charts";
import { burndownSeries } from "@/data/mock";
import { KanbanBoard } from "@/components/mpms/Kanban";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects/$projectId")({
  head: ({ params }) => ({ meta: [{ title: `${params.projectId} — Project` }] }),
  component: ProjectDetails,
});

const TABS = ["Overview", "Sprints", "Tasks", "Team", "Files", "Activity"] as const;

function ProjectDetails() {
  const { projectId } = Route.useParams();
  const project = findProject(projectId);
  if (!project) throw notFound();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const projectSprints = sprints.filter((s) => s.projectId === project.id);
  const projectTasks = allTasks.filter((t) => t.projectId === project.id);

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All projects
      </Link>

      {/* Hero */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-soft relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-64 rounded-full opacity-20 blur-3xl" style={{ background: project.color }} />
        <div className="relative flex items-start gap-5 flex-wrap">
          <div className="size-16 rounded-2xl grid place-items-center text-white font-bold text-lg shadow-glow" style={{ background: project.color }}>
            {project.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-6 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground"><FolderOpen className="size-3.5" /> Client: <span className="text-foreground font-medium">{project.client}</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-3.5" /> Due: <span className="text-foreground font-medium">{project.dueDate}</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="size-3.5" /> Budget: <span className="text-foreground font-medium">${(project.budget/1000).toFixed(0)}k</span></div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="size-3.5" /> Team:</div>
              <AvatarGroup ids={project.team} size={22} />
            </div>
          </div>
          <ProgressRing value={project.progress} size={88} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Tasks Done", value: `${project.tasksDone}/${project.tasksTotal}`, sub: `${Math.round((project.tasksDone/project.tasksTotal)*100)}% complete` },
          { label: "Active Sprints", value: projectSprints.filter(s => s.status === "active").length.toString(), sub: `${projectSprints.length} total` },
          { label: "Budget Burn", value: `${Math.round((project.spent/project.budget)*100)}%`, sub: `$${(project.spent/1000).toFixed(0)}k of $${(project.budget/1000).toFixed(0)}k` },
          { label: "Days Left", value: "47", sub: "until deadline" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{s.label}</div>
            <div className="text-xl font-semibold font-mono mt-1">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Sprint Burndown</h2>
              <span className="text-[11px] text-muted-foreground">Sprint 14 · 10 days</span>
            </div>
            <BurndownChart data={burndownSeries} />
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <h2 className="text-sm font-semibold mb-4">Project Health</h2>
            <div className="space-y-3">
              {[
                { label: "Schedule", value: 82, tone: "primary" as const },
                { label: "Budget", value: Math.round((project.spent/project.budget)*100), tone: "warning" as const },
                { label: "Scope", value: 91, tone: "success" as const },
                { label: "Quality", value: 88, tone: "cool" as const },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono font-semibold">{m.value}%</span>
                  </div>
                  <ProgressBar value={m.value} tone={m.tone} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Sprints" && (
        <div className="space-y-3">
          {projectSprints.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 shadow-soft flex items-center gap-4 flex-wrap">
              <Zap className="size-4 text-primary" />
              <div className="flex-1 min-w-[180px]">
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-[11px] text-muted-foreground">{s.start} → {s.end} · {s.completedPoints}/{s.totalPoints} pts</div>
              </div>
              <div className="w-40"><ProgressBar value={s.progress} tone={s.status === "completed" ? "success" : "primary"} /></div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                s.status === "active" ? "bg-primary/10 text-primary border-primary/20"
                : s.status === "completed" ? "bg-success/10 text-success border-success/20"
                : "bg-muted text-muted-foreground border-border"
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Tasks" && <KanbanBoard tasks={projectTasks} />}

      {tab === "Team" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {project.team.map((id) => {
            const m = findMember(id);
            return (
              <div key={id} className="bg-card border border-border rounded-2xl p-5 shadow-soft text-center">
                <MemberAvatar id={id} size={56} className="mx-auto mb-3" />
                <div className="font-semibold text-sm">{m.name}</div>
                <div className="text-[11px] text-muted-foreground">{m.role} · {m.department}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-muted/60 rounded p-2"><div className="font-mono font-semibold">{m.tasksDone}</div><div className="text-muted-foreground text-[10px]">Done</div></div>
                  <div className="bg-muted/60 rounded p-2"><div className="font-mono font-semibold">{m.tasksOpen}</div><div className="text-muted-foreground text-[10px]">Open</div></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "Files" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Spec v2.pdf","Wireframes.fig","Schema.sql","Roadmap.xlsx","Brief.docx","Mockups.zip"].map((f, i) => (
            <div key={f} className="bg-card border border-border rounded-xl p-4 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="aspect-[4/3] rounded-md bg-muted/60 mb-3 grid place-items-center">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">{f.split(".").pop()}</div>
              </div>
              <div className="text-xs font-medium truncate">{f}</div>
              <div className="text-[10px] text-muted-foreground">{[124, 8400, 12, 312, 96, 5400][i]} KB · 2d ago</div>
            </div>
          ))}
        </div>
      )}

      {tab === "Activity" && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <div className="space-y-5 border-l-2 border-border pl-5 ml-2">
            {activities.map((a) => (
              <div key={a.id} className="relative">
                <div className="absolute -left-[26px] top-1 size-3 rounded-full bg-primary ring-4 ring-background flex items-center justify-center">
                  <ActivityIcon className="size-2 text-white" />
                </div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">{a.time}</div>
                <div className="text-sm"><span className="font-semibold">{a.user}</span> <span className="text-muted-foreground">{a.action}</span> <span className="font-medium text-primary">{a.target}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}