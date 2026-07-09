import { api } from "./api";

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}

export async function updateUserRole(userId: string, role: "admin" | "member") {
    const secret = import.meta.env.VITE_SA_PASSWORD || "nexus_super_2026";
    const response = await api.patch(
        `/admin-panel/users/${userId}/role`,
        { role },
        {
            headers: {
                "X-Super-Admin": secret,
            },
        }
    );
    return response.data;
}

export async function deleteUser(userId: string) {
    const secret = import.meta.env.VITE_SA_PASSWORD || "nexus_super_2026";
    const response = await api.delete(
        `/admin-panel/users/${userId}`,
        {
            headers: {
                "X-Super-Admin": secret,
            },
        }
    );
    return response.data;
}
