import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authJwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token).token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    if (error.response?.status === 403) {
      console.error("Forbidden! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);
