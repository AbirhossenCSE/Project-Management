import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, FolderKanban, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import { ProductivityArea } from "@/components/shared/Charts";
import { PriorityBadge, TaskStatusBadge } from "@/components/shared/Badges";
import { ProgressBar, ProgressRing } from "@/components/shared/Progress";
import { MemberAvatar } from "@/components/shared/Avatar";
import { getMe } from "@/services/auth.service";
import { useProjects, useTasks } from "@/hooks";

export const Route = createFileRoute("/app/")({
    component: UserDashboard,
});

function UserDashboard() {
    const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
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

    const myTasks = useMemo(
        () => tasks.filter((task) => {
            if (!currentUserId) return false;
            return typeof task.assignee === "object" ? task.assignee?._id === currentUserId : task.assignee === currentUserId;
        }),
        [tasks, currentUserId],
    );

    const myProjects = useMemo(
        () => projects.filter((project) => project.owner._id === currentUserId || project.members.some((member) => member._id === currentUserId)),
        [projects, currentUserId],
    );

    if (tasksLoading || projectsLoading || !currentUserId) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto flex min-h-[50vh] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading dashboard...
                </div>
            </div>
        );
    }

    if (tasksError || projectsError || currentUserError) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {tasksError ?? projectsError ?? currentUserError}
                </div>
            </div>
        );
    }

    const productivitySeries = myTasks.length > 0
        ? myTasks.slice(0, 6).map((task, index) => ({ name: `W${index + 1}`, value: task.status === "done" ? 90 : task.status === "in-progress" ? 70 : 45 }))
        : [{ name: "W1", value: 0 }];

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-[1500px] mx-auto">
            <div>
                <div className="text-xs text-muted-foreground mb-1">Live member dashboard</div>
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back.</h1>
                <p className="text-sm text-muted-foreground mt-1">You have {myTasks.filter((task) => task.status !== "done").length} open tasks and {myProjects.length} active projects.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="My Tasks" value={myTasks.length} icon={CheckCircle2} accent="primary" footer={<ProgressBar value={66} />} />
                <StatCard label="Hours Logged" value="32h" delta="+4h" icon={Clock} accent="cyan" footer={<div className="text-[11px] text-muted-foreground">This week · target 40h</div>} />
                <StatCard label="Active Projects" value={myProjects.length} icon={FolderKanban} accent="purple" />
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
                            <div className="font-medium">Current work</div>
                            <div className="text-muted-foreground mt-1">{myTasks.length} tasks in progress</div>
                            <div className="text-muted-foreground">{myProjects.length} projects in scope</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-soft">
                    <h2 className="text-sm font-semibold mb-4">Assigned to me</h2>
                    <div className="space-y-2">
                        {myTasks.map((t) => {
                            const p = typeof t.project === "object" ? t.project : myProjects.find((project) => project._id === t.project);
                            return (
                                <div key={t._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                                    <span className="text-[10px] font-mono text-muted-foreground w-16">{t._id.slice(-6).toUpperCase()}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{t.title}</div>
                                        <div className="text-[10px] text-muted-foreground">{p?.name ?? "Unassigned project"} · Due {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No due date"}</div>
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
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div>No recent activity items are available yet.</div>
                        <div className="text-[11px]">Recent activity will appear here once the activity feed API is connected.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}