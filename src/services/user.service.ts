import { api } from "./api";

export type UserItem = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    avatar?: string;
    createdAt: string;
};

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}