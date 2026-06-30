import { useCallback, useEffect, useState } from "react";

import { getTasks } from "@/services/task.service";

export type TaskItem = {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    assignee?: {
        _id: string;
        name: string;
        email: string;
        role: "admin" | "member";
        avatar?: string;
    } | string;
    project?: {
        _id: string;
        name: string;
        status: string;
    } | string;
    dueDate?: string;
    createdAt: string;
};

export function useTasks(projectId?: string) {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getTasks(projectId ? { project: projectId } : undefined);
            setTasks(response.data.tasks ?? []);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load tasks";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { tasks, loading, error, refetch };
}