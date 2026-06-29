import { api } from "./api";

export type SprintStatus = "planning" | "active" | "completed";

export type SprintPayload = {
    name: string;
    project: string;
    startDate: string;
    endDate: string;
    status?: SprintStatus;
    tasks?: string[];
};

export async function getSprints(projectId: string) {
    const response = await api.get("/sprints", { params: { project: projectId } });
    return response.data;
}

export async function createSprint(data: SprintPayload) {
    const response = await api.post("/sprints", data);
    return response.data;
}

export async function updateSprint(id: string, data: Partial<SprintPayload>) {
    const response = await api.put(`/sprints/${id}`, data);
    return response.data;
}

export async function deleteSprint(id: string) {
    const response = await api.delete(`/sprints/${id}`);
    return response.data;
}