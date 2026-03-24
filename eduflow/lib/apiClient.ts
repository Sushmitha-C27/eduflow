import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "./config";
import type { AuthTokens } from "@/types";
import { useAuthStore } from "@/store/authStore";

type AuthedAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config: AuthedAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AuthedAxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<AuthTokens>(
          `${API_BASE_URL}/auth/refresh`,
          undefined,
          { withCredentials: true }
        );

        const tokens = refreshResponse.data;
        useAuthStore.getState().setTokens(tokens.accessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        return apiClient(originalRequest as AxiosRequestConfig);
      } catch {
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function get<T>(url: string, config?: AxiosRequestConfig) {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  const res = await apiClient.put<T>(url, data, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig) {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}

