import { api, tokenKey } from "./api";

type AuthRole = "admin" | "member";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: AuthRole;
    avatar?: string;
    createdAt: string;
};

export type AuthResponse = {
    success: boolean;
    data: {
        token: string;
        user: AuthUser;
    };
};

function setToken(token: string) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(tokenKey, token);
    }
}

export async function register(name: string, email: string, password: string, role: AuthRole = "member") {
    const response = await api.post<AuthResponse>("/auth/register", { name, email, password, role });
    setToken(response.data.data.token);
    return response.data;
}

export async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    setToken(response.data.data.token);
    return response.data;
}

export async function getMe() {
    const response = await api.get<{ success: boolean; data: { user: AuthUser } }>("/auth/me");
    return response.data;
}

export async function updateMe(name: string) {
    const response = await api.patch<{ success: boolean; data: { user: AuthUser } }>("/auth/me", { name });
    return response.data;
}

export async function changePassword(payload: { currentPassword?: string; newPassword?: string }) {
    const response = await api.patch<{ success: boolean; message: string }>("/auth/change-password", payload);
    return response.data;
}


export function logout() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(tokenKey);
    }
}

export { tokenKey };