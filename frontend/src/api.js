import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: { Accept: "application/json" }
});

api.interceptors.response.use(
  response => response,
  error => {
    const detail = error?.response?.data?.detail || error?.response?.data?.message;
    error.userMessage = detail || (error.code === "ECONNABORTED"
      ? "The server took too long to respond."
      : !error.response
        ? `Cannot reach the API at ${API_BASE_URL}. Check that FastAPI is running.`
        : `Request failed (${error.response.status}).`);
    return Promise.reject(error);
  }
);

export function unwrap(payload) {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload;
  for (const key of ["data", "jobs", "applications", "items", "results"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return payload;
}
export function getErrorMessage(error) {
  return error?.userMessage || error?.response?.data?.detail || error?.message || "Something went wrong.";
}
export const apiRoutes = {
  health: "/health",
  jobs: "/jobs",
  uploadResume: "/resume/upload",
  matchJob: "/jobs/match",
  matchAll: "/jobs/match-all",
  customizeResume: "/resume/customize",
  generateResume: "/resume/generate",
  applications: "/applications",
  autoSave: "/jobs/auto-save"
};