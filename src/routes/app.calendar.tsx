import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getMe } from "@/services/auth.service";
import { useTasks } from "@/hooks";

export const Route = createFileRoute("/app/calendar")({
    component: Calendar,
});

function Calendar() {
    const { tasks, loading, error } = useTasks();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        void getMe().then((response) => {
            if (!mounted) return;
            setCurrentUserId(response.data.user.id);
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

    const calendarTasks = myTasks.filter((task) => !!task.dueDate);
    const days = Array.from({ length: 35 }, (_, index) => index - 3);
    const tasksByDay: Record<number, typeof calendarTasks> = {};

    calendarTasks.forEach((task) => {
        const dueDate = new Date(task.dueDate as string);
        const day = dueDate.getDate();
        (tasksByDay[day] ??= []).push(task);
    });

    if (loading || !currentUserId) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto flex min-h-[50vh] items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading calendar...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
                <p className="text-sm text-muted-foreground mt-1">Task due dates · {calendarTasks.length} scheduled items</p>
            </div>
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
                <div className="grid grid-cols-7 bg-muted/40 text-[10px] uppercase font-semibold tracking-widest text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div key={day} className="p-3 text-center">{day}</div>)}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, index) => (
                        <div key={index} className={`min-h-24 border-r border-b border-border p-2 ${day < 1 || day > 31 ? "bg-muted/20 text-muted-foreground" : ""}`}>
                            <div className="text-[10px] font-mono mb-1">{day > 0 && day <= 31 ? day : ""}</div>
                            <div className="space-y-1">
                                {(tasksByDay[day] || []).slice(0, 2).map((task) => (
                                    <div key={task._id} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{task.title}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}