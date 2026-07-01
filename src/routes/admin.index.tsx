import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Zap, CheckCircle2, Users, Calendar, Plus, ChevronRight, Loader2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ProductivityArea, StatusPie } from "@/components/shared/Charts";
import { ProgressBar, ProgressRing } from "@/components/shared/Progress";
import { StatusBadge } from "@/components/shared/Badges";
import { AvatarGroup, MemberAvatar } from "@/components/shared/Avatar";
import { useProjects, useTasks } from "@/hooks";
import { useAuthUser } from "@/components/layout/auth-user-context";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Nexus.io" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { user } = useAuthUser();

  const loading = projectsLoading || tasksLoading;
  const error = projectsError ?? tasksError;

  const projectCount = projects.length;
  const taskCount = tasks.length;
  const completedTaskCount = tasks.filter((task) => task.status === "done").length;
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const completedProjects = projects.filter((project) => project.status === "completed").length;
  const onHoldProjects = projects.filter((project) => project.status === "on-hold").length;
  const memberIds = new Set<string>();

  projects.forEach((project) => {
    project.members.forEach((member) => memberIds.add(member._id));
    if (project.owner?._id) {
      memberIds.add(project.owner._id);
    }
  });

  const pieData = [
    { name: "Active", value: activeProjects, color: "var(--success)" },
    { name: "On Hold", value: onHoldProjects, color: "var(--warning)" },
    { name: "Completed", value: completedProjects, color: "var(--accent-cyan)" },
  ].filter((entry) => entry.value > 0);

  const projectProgress = projectCount > 0 ? Math.round((completedProjects / projectCount) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-[1600px] mx-auto flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading dashboard...
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
          <div className="text-xs text-muted-foreground mb-1">Monday, May 25</div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, {user?.name ?? "there"}.</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your workspace today.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-card border border-border px-3 py-2 rounded-md text-xs font-medium hover:bg-muted transition-colors inline-flex items-center gap-2">
            <Calendar className="size-3.5" /> Last 30 days
          </button>
          <button className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2 hover:opacity-95">
            <Plus className="size-3.5" /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={projectCount} delta="Live" icon={FolderKanban} accent="primary"
          footer={<div className="text-[11px] text-muted-foreground">{activeProjects} active · {onHoldProjects} on hold · {completedProjects} completed</div>} />
        <StatCard label="Active Sprints" value={0} delta="API ready" icon={Zap} accent="cyan"
          footer={<div className="text-[11px] text-muted-foreground">Sprint metrics will appear once sprint overview is added.</div>} />
        <StatCard label="Tasks Completed" value={completedTaskCount} delta="Live" icon={CheckCircle2} accent="success"
          footer={<div className="text-[11px] text-muted-foreground">{taskCount} total tasks</div>} />
        <StatCard label="Team Members" value={memberIds.size} icon={Users} accent="purple"
          footer={
            <div className="flex items-center justify-between">
              <AvatarGroup members={projects.flatMap((project) => [project.owner, ...project.members]).slice(0, 5)} max={4} size={22} />
              <span className="text-[11px] text-success font-medium">Workspace team</span>
            </div>
          } />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Productivity Analytics</h2>
              <p className="text-[11px] text-muted-foreground">Task completion snapshot — live workspace data</p>
            </div>
            <div className="flex gap-1.5 text-[10px]">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 text-primary"><span className="size-1.5 rounded-full bg-primary" /> Done</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-accent-cyan/15 text-accent-cyan"><span className="size-1.5 rounded-full bg-accent-cyan" /> All tasks</span>
            </div>
          </div>
          <ProductivityArea
            data={[
              { day: "Mon", done: completedTaskCount, opened: taskCount },
              { day: "Tue", done: completedTaskCount, opened: taskCount },
              { day: "Wed", done: completedTaskCount, opened: taskCount },
              { day: "Thu", done: completedTaskCount, opened: taskCount },
              { day: "Fri", done: completedTaskCount, opened: taskCount },
              { day: "Sat", done: completedTaskCount, opened: taskCount },
              { day: "Sun", done: completedTaskCount, opened: taskCount },
            ]}
          />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Project Health</h2>
            <span className="text-[10px] text-muted-foreground font-mono">{projectCount} total</span>
          </div>
          <StatusPie data={pieData.length > 0 ? pieData : [{ name: "No projects", value: 1, color: "var(--muted-foreground)" }]} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            {(pieData.length > 0 ? pieData : [{ name: "No projects", value: 0, color: "var(--muted-foreground)" }]).map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: p.color }} />
                <span className="text-muted-foreground">{p.name}</span>
                <span className="ml-auto font-mono font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">Active Projects</h2>
            <Link to="/admin/projects" className="text-[11px] text-primary font-medium inline-flex items-center gap-0.5 hover:underline">
              View all <ChevronRight className="size-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p._id}
                to="/admin/projects/$projectId"
                params={{ projectId: p._id }}
                className="p-4 sm:p-5 flex items-center gap-4 hover:bg-muted/40 transition-colors group"
              >
                <div className="size-10 rounded-xl grid place-items-center text-white text-xs font-bold shrink-0 bg-primary">
                  {p.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{p.name}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{p.description}</div>
                </div>
                <div className="hidden sm:flex w-40 flex-col gap-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Members</span>
                    <span className="font-mono font-semibold">{p.members.length}</span>
                  </div>
                  <ProgressBar value={Math.min(100, (p.members.length / Math.max(1, memberIds.size)) * 100)} tone={p.status === "completed" ? "success" : p.status === "on-hold" ? "warning" : "primary"} />
                </div>
                <div className="hidden md:block"><AvatarGroup members={[p.owner, ...p.members]} max={3} size={24} /></div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Side rail */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 3).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="text-center w-10 shrink-0">
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">{["May", "May", "Jun"][i]}</div>
                    <div className="text-base font-semibold font-mono">{["28", "30", "02"][i]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.owner.name}</div>
                  </div>
                  <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${i === 0 ? "bg-destructive/10 text-destructive" : i === 1 ? "bg-warning/10 text-warning-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                    T-{[2, 5, 8][i]}d
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <h2 className="text-sm font-semibold mb-4">Team Performance</h2>
            <div className="flex items-center gap-4 mb-4">
              <ProgressRing value={projectProgress} size={72} />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Average velocity</div>
                <div className="text-base font-semibold">{taskCount} tasks in workspace</div>
                <div className="text-[11px] text-success mt-1">{completedTaskCount} completed</div>
              </div>
            </div>
            <div className="space-y-2">
              {["Engineering", "Design", "Product"].map((t, i) => (
                <div key={t} className="flex items-center gap-2 text-[11px]">
                  <span className="w-20 text-muted-foreground">{t}</span>
                  <ProgressBar value={projectCount > 0 ? Math.round((projects.filter((project) => project.status === (i === 0 ? "active" : i === 1 ? "on-hold" : "completed")).length / projectCount) * 100) : 0} tone={i === 0 ? "primary" : i === 1 ? "cool" : "warning"} className="flex-1" />
                  <span className="font-mono font-semibold w-7 text-right">{projectCount > 0 ? Math.round((projects.filter((project) => project.status === (i === 0 ? "active" : i === 1 ? "on-hold" : "completed")).length / projectCount) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <button className="text-[11px] text-primary font-medium hover:underline">View audit log →</button>
        </div>
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task, index) => (
            <div key={task._id} className="flex gap-3 items-start">
              <MemberAvatar
                member={typeof task.assignee === "object" && task.assignee
                  ? task.assignee
                  : { id: `m${(index % 5) + 1}`, name: `Member ${index + 1}` }}
                size={28}
              />
              <div className="flex-1 text-sm">
                <span className="font-medium">{typeof task.assignee === "object" ? task.assignee.name : "Team member"}</span>
                <span className="text-muted-foreground"> updated task </span>
                <span className="font-medium text-primary">{task.title}</span>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{task.createdAt}</div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${task.status === "done" ? "border-success/30 bg-success/10 text-success"
                : task.status === "in-progress" ? "border-accent-cyan/30 bg-accent-cyan/15 text-accent-cyan"
                  : "border-primary/30 bg-primary/10 text-primary"
                }`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}