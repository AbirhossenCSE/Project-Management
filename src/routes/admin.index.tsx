import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Zap, CheckCircle2, Users, Calendar, Plus, ChevronRight, Loader2, ChevronDown, Check } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ProductivityArea, StatusPie } from "@/components/shared/Charts";
import { ProgressBar, ProgressRing } from "@/components/shared/Progress";
import { StatusBadge } from "@/components/shared/Badges";
import { AvatarGroup, MemberAvatar } from "@/components/shared/Avatar";
import { useProjects, useTasks, useUsers } from "@/hooks";
import { useAuthUser } from "@/components/layout/auth-user-context";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { createProject, type ProjectPayload, type ProjectStatus } from "@/services/project.service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Nexus.io" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { users, loading: usersLoading } = useUsers();
  const { user } = useAuthUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    status: ProjectStatus;
    members: string[];
  }>({
    name: "",
    description: "",
    status: "active",
    members: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);

  const selectedMembers = useMemo(
    () => users.filter((u) => form.members.includes(u._id)),
    [form.members, users],
  );

  function toggleMember(memberId: string) {
    setForm((current) => ({
      ...current,
      members: current.members.includes(memberId)
        ? current.members.filter((id) => id !== memberId)
        : [...current.members, memberId],
    }));
  }

  async function handleSaveProject() {
    if (!form.name.trim() || !form.description.trim()) {
      setFormError("Name and description are required");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: ProjectPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        members: form.members,
      };
      await createProject(payload);
      toast.success("Project created successfully");
      await refetch();
      setForm({ name: "", description: "", status: "active", members: [] });
      setCreateOpen(false);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create project";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

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
          <button 
            onClick={() => setCreateOpen(true)}
            className="gradient-primary text-white px-3 py-2 rounded-md text-xs font-semibold shadow-glow inline-flex items-center gap-2 hover:opacity-95 cursor-pointer"
          >
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
                <StatusBadge status={p.status as any} />
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
                <div key={p._id} className="flex items-center gap-3">
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>Add a new project to the live API-backed list.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {formError && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{formError}</div>}
            <div className="space-y-2">
              <label className="text-xs font-semibold">Name</label>
              <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} placeholder="Project description" rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(["active", "completed", "on-hold"] as ProjectStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, status }))}
                    className={cn(
                      "rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
                      form.status === status ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold">Members</label>
                <span className="text-[10px] text-muted-foreground">{selectedMembers.length} selected</span>
              </div>
              <Popover open={membersOpen} onOpenChange={setMembersOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-between">
                    <span className="truncate">
                      {selectedMembers.length > 0 ? selectedMembers.map((member) => member.name).join(", ") : "Select team members"}
                    </span>
                    <ChevronDown className="size-4 shrink-0 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {users.map((user) => {
                      const checked = form.members.includes(user._id);
                      return (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => toggleMember(user._id)}
                          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                        >
                          <Checkbox checked={checked} />
                          <MemberAvatar member={user} size={28} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{user.name}</div>
                            <div className="truncate text-[11px] text-muted-foreground">{user.email} · {user.role}</div>
                          </div>
                          {checked && <Check className="size-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="button" onClick={() => void handleSaveProject()} disabled={submitting} className="gradient-primary text-white shadow-glow">
              {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {submitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}