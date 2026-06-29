import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, FolderKanban, MessageSquare } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { ProductivityArea } from "@/components/shared/Charts";
import { productivitySeries, tasks, findProject, activities } from "@/data/mock";
import { PriorityBadge, TaskStatusBadge } from "@/components/shared/Badges";
import { ProgressBar, ProgressRing } from "@/components/shared/Progress";
import { MemberAvatar } from "@/components/shared/Avatar";

export const Route = createFileRoute("/app/")({
  component: UserDashboard,
});

function UserDashboard() {
  const myTasks = tasks.filter((t) => t.assignee === "m2");
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Monday, May 25</div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Marcus.</h1>
        <p className="text-sm text-muted-foreground mt-1">You have {myTasks.filter(t => t.status !== "done").length} open tasks and 2 reviews waiting.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Tasks" value={myTasks.length} icon={CheckCircle2} accent="primary" footer={<ProgressBar value={66} />} />
        <StatCard label="Hours Logged" value="32h" delta="+4h" icon={Clock} accent="cyan" footer={<div className="text-[11px] text-muted-foreground">This week · target 40h</div>} />
        <StatCard label="Active Projects" value="3" icon={FolderKanban} accent="purple" />
        <StatCard label="Pending Reviews" value="2" icon={MessageSquare} accent="warning" footer={<Link to="/app/tasks" className="text-[11px] text-primary font-medium hover:underline">Review now →</Link>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">My productivity</h2>
          <ProductivityArea data={productivitySeries} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Sprint progress</h2>
          <div className="flex items-center gap-4">
            <ProgressRing value={72} size={88} />
            <div className="flex-1 text-xs">
              <div className="font-medium">Sprint 14 — Realtime Pipes</div>
              <div className="text-muted-foreground mt-1">37 of 52 pts complete</div>
              <div className="text-muted-foreground">3 days remaining</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Assigned to me</h2>
          <div className="space-y-2">
            {myTasks.map((t) => {
              const p = findProject(t.projectId);
              return (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  <span className="text-[10px] font-mono text-muted-foreground w-16">{t.key}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground">{p?.name} · Due {t.dueDate}</div>
                  </div>
                  <PriorityBadge priority={t.priority} />
                  <TaskStatusBadge status={t.status} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h2 className="text-sm font-semibold mb-4">Recent comments</h2>
          <div className="space-y-4">
            {activities.filter(a => a.type === "comment" || a.type === "assign").slice(0, 5).map((a, i) => (
              <div key={a.id} className="flex gap-3">
                <MemberAvatar id={`m${(i % 7) + 1}`} size={26} />
                <div className="text-xs">
                  <span className="font-medium">{a.user}</span> <span className="text-muted-foreground">{a.action}</span> <span className="text-primary">{a.target}</span>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}