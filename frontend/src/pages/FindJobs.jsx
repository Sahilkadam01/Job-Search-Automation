
import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, BriefcaseBusiness, ExternalLink, RefreshCw } from "lucide-react";
import { fetchJobs } from "../services/api";

function getJobUrl(job) {
  const value = job.url || job.job_url || job.apply_url || job.link;

  if (!value) return null;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    setLoading(true);
    setError("");

    try {
      const response = await fetchJobs();

      const items = Array.isArray(response)
        ? response
        : response?.jobs || response?.data || response?.results || [];

      if (!Array.isArray(items)) {
        throw new Error("The API returned an unexpected jobs format.");
      }

      setJobs(items);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not load jobs. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const place = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const title = job.title || job.role || job.job_title || "";
      const company = job.company || job.company_name || "";
      const description = job.description || "";
      const jobLocation = job.location || job.job_location || "";

      const matchesSearch =
        !query ||
        `${title} ${company} ${description}`.toLowerCase().includes(query);

      const matchesLocation =
        !place || jobLocation.toLowerCase().includes(place);

      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-violet-600">
          Job Discovery
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Find Jobs
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Search and explore opportunities from your job database.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Job title, company, or keyword"
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Filter by location"
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />
        </div>

        <button
          type="button"
          onClick={loadJobs}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? "Loading jobs..." : `${filteredJobs.length} jobs found`}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Unable to load jobs</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            onClick={loadJobs}
            className="mt-3 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Fetching jobs from your backend...
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <BriefcaseBusiness
            size={36}
            className="mx-auto text-slate-300"
          />
          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No jobs found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try different search terms or check whether your backend has saved jobs.
          </p>
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobs.map((job, index) => {
            const title =
              job.title || job.role || job.job_title || "Untitled position";
            const company =
              job.company || job.company_name || "Company not specified";
            const jobLocation =
              job.location || job.job_location || "Location not specified";
            const url = getJobUrl(job);
            const key = job.id || job.job_id || `${title}-${company}-${index}`;

            return (
              <article
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <BriefcaseBusiness size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900">
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {company}
                    </p>
                  </div>

                  {job.match_score != null && (
                    <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {Math.round(Number(job.match_score))}% match
                    </span>
                  )}
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={15} />
                  {jobLocation}
                </p>

                {job.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>
                )}

                <div className="mt-5 border-t border-slate-100 pt-4">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      View Job <ExternalLink size={15} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No job application link provided
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
