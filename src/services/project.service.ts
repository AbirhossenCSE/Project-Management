import { api } from "./api";

export type ProjectStatus = "active" | "completed" | "on-hold";

export type ProjectPayload = {
    name: string;
    description: string;
    status?: ProjectStatus;
    members?: string[];
};

export async function getProjects() {
    const response = await api.get("/projects");
    return response.data;
}

export async function getProjectById(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
}

export async function createProject(data: ProjectPayload) {
    const response = await api.post("/projects", data);
    return response.data;
}

export async function updateProject(id: string, data: Partial<ProjectPayload>) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
}

export async function deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
}