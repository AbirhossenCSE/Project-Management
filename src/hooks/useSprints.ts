import { useCallback, useEffect, useState, useRef } from "react";

import { getSprints } from "@/services/sprint.service";

export type SprintItem = {
    _id: string;
    name: string;
    project: string | { _id: string; name: string };
    startDate: string;
    endDate: string;
    status: "planning" | "active" | "completed";
    tasks: string[];
    createdAt: string;
};

export function useSprints(projectId: string | string[]) {
    const [sprints, setSprints] = useState<SprintItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasLoadedOnce = useRef(false);

    const serializedProjectId = Array.isArray(projectId) ? projectId.join(",") : projectId;

    const refetch = useCallback(async () => {
        const projectIds = serializedProjectId ? serializedProjectId.split(",") : [];
        const filteredProjectIds = projectIds.filter(Boolean);

        if (filteredProjectIds.length === 0) {
            setSprints([]);
            setLoading(false);
            return;
        }

        if (!hasLoadedOnce.current) {
            setLoading(true);
        }
        setError(null);

        try {
            const responses = await Promise.all(filteredProjectIds.map((id) => getSprints(id)));
            const nextSprints = responses.flatMap((response) => response.data.sprints ?? []);
            setSprints(nextSprints);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load sprints";
            setError(message);
        } finally {
            setLoading(false);
            hasLoadedOnce.current = true;
        }
    }, [serializedProjectId]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { sprints, loading, error, refetch };
}