import axios from "axios";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000")
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/+$/, "");

export const api = axios.create({
  baseURL: `${apiBaseUrl}/api/v1`,
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);