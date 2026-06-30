import { useCallback, useEffect, useState } from "react";

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

export function useSprints(projectId: string) {
    const [sprints, setSprints] = useState<SprintItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(async () => {
        if (!projectId) {
            setSprints([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getSprints(projectId);
            setSprints(response.data.sprints ?? []);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to load sprints";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refetch();
    }, [refetch]);

    return { sprints, loading, error, refetch };
}