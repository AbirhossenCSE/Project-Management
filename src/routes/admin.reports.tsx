import { createFileRoute } from "@tanstack/react-router";
import { Download, Loader2, BarChart3, AlertCircle } from "lucide-react";
import { StatusPie, VelocityBars } from "@/components/shared/Charts";
import { useProjects, useTasks, useSprints, useUsers } from "@/hooks";
import { ReportsSkeleton } from "@/components/shared/Skeleton";
import { useMemo } from "react";
import { ProgressBar } from "@/components/shared/Progress";
import { MemberAvatar } from "@/components/shared/Avatar";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Admin" }] }),
  component: Reports,
});

function Reports() {
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const projectIds = useMemo(() => projects.map(p => p._id), [projects]);
  const { sprints, loading: sprintsLoading, error: sprintsError } = useSprints(projectIds);

  const loading = projectsLoading || tasksLoading || sprintsLoading || usersLoading;
  const error = projectsError ?? tasksError ?? sprintsError ?? usersError;

  const stats = useMemo(() => {
    if (loading || error || !tasks || !projects || !sprints || !users) {
      return {
        pieData: [],
        velocity: [],
        cards: [],
        teamRanking: []
      };
    }

    // 1. Total tasks by status
    const doneTasks = tasks.filter(t => t.status === "done").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const todoTasks = tasks.filter(t => t.status === "todo").length;

    const pieData = [
      { name: "Done", value: doneTasks, color: "var(--success)" },
      { name: "In Progress", value: inProgressTasks, color: "var(--primary)" },
      { name: "To Do", value: todoTasks, color: "var(--muted-foreground)" },
    ].filter(item => item.value > 0);

    // If all tasks are 0, fallback to show 0
    if (pieData.length === 0) {
      pieData.push(
        { name: "Done", value: 0, color: "var(--success)" },
        { name: "In Progress", value: 0, color: "var(--primary)" },
        { name: "To Do", value: 0, color: "var(--muted-foreground)" }
      );
    }

    // 2. Sprint Velocity
    const velocity = sprints
      .filter(s => s.status !== "planning")
      .map(s => {
        // Calculate velocity as the number of tasks in this sprint that are 'done'
        const value = s.tasks.filter(taskId => {
          const task = tasks.find(t => t._id === taskId);
          return task?.status === "done";
        }).length;

        return {
          name: s.name.split("—")[0].trim(),
          value,
        };
      });

    // 3. Top cards stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === "active").length;
    const completedProjects = projects.filter(p => p.status === "completed").length;

    const health = totalProjects > 0 
      ? Math.round(((activeProjects + completedProjects) / totalProjects) * 100)
      : 100;

    const completedSprints = sprints.filter(s => s.status === "completed");
    const totalVelocity = completedSprints.reduce((acc, s) => {
      const val = s.tasks.filter(taskId => {
        const task = tasks.find(t => t._id === taskId);
        return task?.status === "done";
      }).length;
      return acc + val;
    }, 0);
    const avgVelocity = completedSprints.length > 0 
      ? (totalVelocity / completedSprints.length).toFixed(1)
      : "0.0";

    const cards = [
      { label: "Total Projects", value: totalProjects, delta: `${activeProjects} Active` },
      { label: "Project Health", value: `${health}%`, delta: "Active/Completed ratio" },
      { label: "Total Tasks", value: tasks.length, delta: `${doneTasks} completed` },
      { label: "Avg Sprint Velocity", value: avgVelocity, delta: "tasks/completed sprint" },
    ];

    // 4. Team Productivity Ranking
    const teamRanking = users
      .map(u => {
        const userTasks = tasks.filter(t => {
          const assigneeId = typeof t.assignee === "string" ? t.assignee : t.assignee?._id;
          return assigneeId === u._id;
        });
        const total = userTasks.length;
        const completed = userTasks.filter(t => t.status === "done").length;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          _id: u._id,
          id: u._id,
          name: u.name,
          role: u.role,
          department: "Engineering",
          productivity,
          totalTasks: total,
          avatar: u.avatar
        };
      })
      .sort((a, b) => b.productivity - a.productivity);

    return { pieData, velocity, cards, teamRanking };
  }, [loading, error, projects, tasks, sprints, users]);

  if (loading) {
    return <ReportsSkeleton />;
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

  const { pieData, velocity, cards, teamRanking } = stats;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep visibility into delivery, capacity, and quality.</p>
        </div>
        <button className="bg-card border border-border px-3 py-2 rounded-md text-xs font-medium inline-flex items-center gap-2 hover:bg-muted">
          <Download className="size-3.5" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((k) => (
          <div key={k.label} className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <div className="text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">{k.label}</div>
            <div className="text-2xl font-semibold font-mono mt-1">{k.value}</div>
            <div className="text-[11px] text-success font-medium mt-1">{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col">
          <h2 className="text-sm font-semibold mb-4">Productivity Trend</h2>
          <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
            <BarChart3 className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
            <span className="text-xs">Insufficient data to plot productivity trend</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Task Distribution</h2>
          <StatusPie data={pieData} />
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-mono font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Sprint Velocity</h2>
          {velocity.length > 0 ? (
            <VelocityBars data={velocity} />
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
              <AlertCircle className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
              <span className="text-xs">No active or completed sprints</span>
            </div>
          )}
        </div>
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Workload Heatmap</h2>
            <span className="text-[11px] text-muted-foreground">Hours per day · last 16 days</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl py-6 min-h-[180px]">
            <AlertCircle className="size-8 mb-2 stroke-[1.5] text-muted-foreground/60" />
            <span className="text-xs">Insufficient data to plot workload heatmap</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
        <h2 className="text-sm font-semibold mb-4">Team Productivity Ranking</h2>
        <div className="space-y-3">
          {teamRanking.slice(0, 6).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-muted grid place-items-center text-[10px] font-bold font-mono">{i + 1}</div>
              <MemberAvatar member={m} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{m.name}</div>
                <div className="text-[10px] text-muted-foreground">{m.role} · {m.totalTasks} tasks</div>
              </div>
              <div className="w-40"><ProgressBar value={m.productivity} tone={m.productivity > 85 ? "success" : "primary"} /></div>
              <span className="font-mono font-semibold text-sm w-10 text-right">{m.productivity}%</span>
            </div>
          ))}
          {teamRanking.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-4">No team members found</div>
          )}
        </div>
      </div>
    </div>
  );
}