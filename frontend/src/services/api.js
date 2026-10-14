import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

export async function checkBackendHealth() {
  const response = await api.get("/health");
  return response.data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/resume/upload", formData);
  return response.data;
}

export async function fetchJobs() {
  const response = await api.get("/jobs");
  return response.data;
}

export default api;