import axios, { AxiosInstance, HttpStatusCode } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

let authToken: string | null = null;

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export const setAuthToken: (token: string | null) => void = (token: string | null): void => {
  authToken = token;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      console.error("Unauthorized!");
    }
    if (error.response?.status === HttpStatusCode.Forbidden) {
      console.error("Forbidden!");
    }
    return Promise.reject(error);
  }
);
