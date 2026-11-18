
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 240000,
  headers: {
    Accept: "application/json",
  },
});

// Automatically attach JWT authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Backend health check
export async function checkBackendHealth() {
  const response = await api.get("/health");
  return response.data;
}

// Resume upload
export async function uploadResume(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/resume/upload", formData);

  return response.data;
}

// Fetch jobs
export async function fetchJobs() {
  const response = await api.get("/jobs");

  return response.data;
}

// Get authenticated user
export async function getCurrentUser() {
  const response = await api.get("/auth/me");

  return response.data;
}

// Login
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);

  return response.data;
}

// Register
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data;
}

export default api;
