import { api } from "./api";

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}

export async function updateUserRole(userId: string, role: "admin" | "member") {
    const response = await api.patch(
        `/admin-panel/users/${userId}/role`,
        { role }
    );
    return response.data;
}

export async function deleteUser(userId: string) {
    const response = await api.delete(
        `/admin-panel/users/${userId}`
    );
    return response.data;
}
