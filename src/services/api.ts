import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const tokenKey = "token";

export const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = window.localStorage.getItem(tokenKey);
        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && typeof window !== "undefined") {
            window.localStorage.removeItem(tokenKey);
            window.location.assign("/login");
        }

        return Promise.reject(error);
    },
);

export { tokenKey };