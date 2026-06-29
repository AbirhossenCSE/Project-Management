import { api } from "./api";

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type TaskPayload = {
    title: string;
    description: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee: string;
    project: string;
    dueDate?: string;
};

export type TaskFilters = {
    project?: string;
    status?: TaskStatus;
    assignee?: string;
};

export async function getTasks(filters?: TaskFilters) {
    const response = await api.get("/tasks", { params: filters });
    return response.data;
}

export async function getTaskById(id: string) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
}

export async function createTask(data: TaskPayload) {
    const response = await api.post("/tasks", data);
    return response.data;
}

export async function updateTask(id: string, data: Partial<TaskPayload>) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
}

export async function deleteTask(id: string) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
}