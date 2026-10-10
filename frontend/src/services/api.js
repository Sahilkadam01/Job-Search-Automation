const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error(
      "Cannot connect to the backend. Check your API URL and FastAPI server."
    );
  }

  const contentType = response.headers.get("content-type") || "";
  let data;

  try {
    data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      data && typeof data === "object"
        ? data.detail || data.message
        : data;

    throw new Error(
      typeof detail === "string"
        ? detail
        : `Request failed with status ${response.status}.`
    );
  }

  return data;
}

function postJson(body) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

export const api = {
  baseUrl: API_BASE_URL,

  health() {
    return request("/health");
  },

  getJobs() {
    return request("/jobs");
  },

  uploadResume(file) {
    const formData = new FormData();
    formData.append("file", file);

    return request("/resume/upload", {
      method: "POST",
      body: formData
    });
  },

  matchAllJobs() {
    return request("/jobs/match-all", {
      method: "POST"
    });
  },

  getApplications() {
    return request("/applications");
  },

  autoSaveJobs() {
    return request("/jobs/auto-save", {
      method: "POST"
    });
  },

  // Confirm the request schema in your FastAPI handler before using.
  matchJob(job) {
    return request("/jobs/match", postJson(job));
  }
};

export function listOf(data, keys = []) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    for (const key of [...keys, "data", "results", "items"]) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }

  return [];
}

export function titleOf(job) {
  return (
    job?.title ||
    job?.job_title ||
    job?.position ||
    job?.role ||
    "Untitled role"
  );
}

export function companyOf(job) {
  return (
    job?.company ||
    job?.company_name ||
    job?.employer ||
    "Company not specified"
  );
}

export function locationOf(job) {
  return (
    job?.location ||
    job?.city ||
    job?.job_location ||
    "Location not specified"
  );
}

export function linkOf(job) {
  return (
    job?.url ||
    job?.job_url ||
    job?.apply_url ||
    job?.redirect_url ||
    ""
  );
}

export function scoreOf(job) {
  const raw = job?.match_score ?? job?.matchScore ?? job?.score;

  if (raw === undefined || raw === null || raw === "") {
    return null;
  }

  const score = Number(raw);

  return Number.isFinite(score)
    ? Math.max(0, Math.min(100, score))
    : null;
}