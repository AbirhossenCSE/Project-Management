import { useCallback, useEffect, useState } from "react";

import { getProjects } from "@/services/project.service";

export type ProjectMember = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    avatar?: string;
};

export type ProjectItem = {
    _id: string;
    name: string;
    description: string;
    status: "active" | "completed" | "on-hold";
    owner: ProjectMember;
    members: ProjectMember[];
    createdAt: string;
};

export function useProjects() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getProjects();
            setProjects(response.data.projects ?? []);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load projects";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { projects, loading, error, refetch };
}