import { paths } from "@/config/paths";
import Axios, { type InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (!config) return config;
    if (config.headers) config.headers.Accept = "application/json";
    config.withCredentials = true;
    return config;
}

export const api = Axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const defaultError = "An unexpected error occurred";
        
        if (error.response?.status === 401) {
            const searchParams = new URLSearchParams();
            const redirectTo = searchParams.get("redirectTo") || window.location.pathname;
            window.location.href = paths.auth.login.getHref(redirectTo);
        }

        const errorMessage = error.response?.data?.error || defaultError;
        return Promise.reject(new Error(errorMessage));
    },
);
