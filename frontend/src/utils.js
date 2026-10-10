export function unwrapList(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of [...keys, "jobs", "applications", "results", "items", "data"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
}
export function jobTitle(job = {}) { return job.title || job.position || job.job_title || job.role || "Untitled role"; }
export function companyName(job = {}) { return job.company_name || job.company || job.organization || job.employer || "Company not listed"; }
export function jobLocation(job = {}) { return job.location || job.city || job.remote || "Location not listed"; }
export function jobUrl(job = {}) { return job.url || job.job_url || job.apply_url || job.redirect_url || ""; }
export function matchScore(job = {}) { const v = job.match_score ?? job.score ?? job.match_percentage; const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(100, n <= 1 && n > 0 ? Math.round(n * 100) : Math.round(n))) : null; }
export function getErrorMessage(error) { return error?.message || "Something went wrong. Please try again."; }
export function formatDate(value) { if (!value) return "—"; const d = new Date(value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(); }
