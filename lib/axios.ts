import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { mockAdapter } from "@/lib/mock/adapter";

export const TOKEN_KEY = "lashesbyzee";

// Mock data until the API exists: set NEXT_PUBLIC_USE_MOCK=false and NEXT_PUBLIC_API_URL to switch over.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const axiosInstance = axios.create({
  baseURL: USE_MOCK ? "" : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  adapter: USE_MOCK ? mockAdapter : undefined,
});

// Request interceptor: attach the access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    const token = raw ? JSON.parse(raw) : null;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// One refresh at a time; other failed requests wait in a queue
let isRefreshing = false;
let failedQueue: { resolve: (t: string) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error || !token ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.post("/auth/refreshToken", {}, { withCredentials: true });
    const accessToken = response?.data?.data?.accessToken;
    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(accessToken));
      const { default: store } = await import("@/redux/store"); // runtime import breaks the circular dependency
      store.dispatch({ type: "auth/setToken", payload: accessToken });
      return accessToken;
    }
    return null;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    const { default: store } = await import("@/redux/store");
    store.dispatch({ type: "auth/logout" });
    return null;
  }
};

// Response interceptor: on an expired token, refresh once and retry the original request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isTokenExpired = error.response?.status === 401 && error.response?.data?.message === "JWT Expired";
    const isRefreshCall = originalRequest?.url?.includes("/auth/refreshToken");

    if (isTokenExpired && !originalRequest._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => failedQueue.push({ resolve, reject })).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      if (newToken) {
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
      processQueue(error, null);
    }
    return Promise.reject(error);
  }
);

/** The API's own message for a failed request, or a fallback */
export const apiError = (e: unknown, fallback = "Something went wrong") =>
  (e as AxiosError<{ message?: string }>)?.response?.data?.message || (e as Error)?.message || fallback;

export default axiosInstance;
