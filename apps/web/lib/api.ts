import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = (error.config as InternalAxiosRequestConfig)?.url ?? "";

    if (status === 401 && !url.includes("/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(new Error("Network error. Check your connection."));
    }

    const message =
      (error.response.data as any)?.message ?? "Something went wrong.";
    return Promise.reject(new Error(message));
  },
);

export default api;
