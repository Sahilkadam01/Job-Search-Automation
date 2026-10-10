const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    data = await response.text().catch(() => "");
  }
  if (!response.ok) {
    const detail = data?.detail || data?.message || (typeof data === "string" ? data : "");
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail) || `Request failed (${response.status})`);
  }
  return data;
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) } });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_BASE_URL}. Start FastAPI with: uvicorn app.main:app --reload`);
  }
  return handleResponse(response);
}

const qs = (values = {}) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, String(value)); });
  const result = params.toString();
  return result ? `?${result}` : "";
};

export const getApiBaseUrl = () => API_BASE_URL;
export const checkBackendHealth = () => request("/health");
export const getJobs = (search = "", limit = 30) => request(`/jobs${qs({ search, limit })}`);
export const matchAllJobs = (resumeProfile, search = "", limit = 30) => request(`/jobs/match-all${qs({ search, limit })}`, { method: "POST", body: JSON.stringify(resumeProfile || {}) });
export function uploadResume(file) {
  const formData = new FormData(); formData.append("file", file);
  return request("/resume/upload", { method: "POST", body: formData });
}
export const getApplications = () => request("/applications");
export const createApplication = (application) => request("/applications", { method: "POST", body: JSON.stringify(application) });
export const updateApplication = (id, data) => request(`/applications/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteApplication = (id) => request(`/applications/${id}`, { method: "DELETE" });
export const customizeResume = (resumeProfile, job) => request("/resume/customize", { method: "POST", body: JSON.stringify({ resume_profile: resumeProfile, job }) });
export async function generateResume(resumeProfile, job) {
  const response = await fetch(`${API_BASE_URL}/resume/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume_profile: resumeProfile, job }) }).catch(() => { throw new Error(`Cannot reach the backend at ${API_BASE_URL}.`); });
  if (!response.ok) return handleResponse(response);
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const filename = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i)?.[1] || "tailored-resume.docx";
  return { blob, filename: decodeURIComponent(filename.replace(/"/g, "")) };
}
export const autoSaveJobs = ({ search = "", limit = 10, minimumScore = 70 } = {}) => request(`/jobs/auto-save${qs({ search, limit, minimum_score: minimumScore })}`, { method: "POST", body: JSON.stringify({}) });
