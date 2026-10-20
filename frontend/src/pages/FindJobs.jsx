
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { fetchJobs } from "../services/api";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import JobDetailsModal from "../components/jobs/JobDetailsModal";

const SAVED_JOBS_KEY = "ai-job-hunter-saved-jobs";

function normalizeJobs(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getJobId(job) {
  return (
    job.id ||
    job.job_id ||
    job.url ||
    job.job_url ||
    `${job.title || "job"}-${job.company || job.company_name || ""}`
  );
}

function readSavedJobs() {
  try {
    const value = localStorage.getItem(SAVED_JOBS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minMatch, setMinMatch] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [savedIds, setSavedIds] = useState(
    () => new Set(readSavedJobs().map(getJobId))
  );

  const loadJobs = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetchJobs();
      setJobs(normalizeJobs(response));
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to load jobs. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const title = String(job.title || "").toLowerCase();
      const company = String(
        job.company || job.company_name || ""
      ).toLowerCase();
      const description = String(job.description || "").toLowerCase();
      const jobLocation = String(job.location || "").toLowerCase();

      const type = String(
        job.job_type || job.employment_type || ""
      ).toLowerCase();

      const score = Number(job.match_score ?? 0);

      const matchesSearch =
        !searchText ||
        `${title} ${company} ${description}`.includes(searchText);

      const matchesLocation =
        !locationText || jobLocation.includes(locationText);

      const normalizedType = jobType.toLowerCase();
      const matchesType =
        !normalizedType ||
        type.includes(normalizedType) ||
        (normalizedType === "remote" &&
          jobLocation.includes("remote"));

      const matchesScore = score >= Number(minMatch);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesScore
      );
    });
  }, [jobs, search, location, jobType, minMatch]);

  function resetFilters() {
    setSearch("");
    setLocation("");
    setJobType("");
    setMinMatch(0);
  }

  function toggleSavedJob(job) {
    const jobId = getJobId(job);
    const currentJobs = readSavedJobs();
    const alreadySaved = currentJobs.some(
      (item) => getJobId(item) === jobId
    );

    const updatedJobs = alreadySaved
      ? currentJobs.filter((item) => getJobId(item) !== jobId)
      : [...currentJobs, job];

    try {
      localStorage.setItem(
        SAVED_JOBS_KEY,
        JSON.stringify(updatedJobs)
      );

      setSavedIds(new Set(updatedJobs.map(getJobId)));
    } catch {
      setError("Unable to save this job in browser storage.");
    }
  }

  function handleApply(job) {
    // This callback records the user's intent in the console.
    // It does not submit an application to the employer.
    console.info("Job application link opened:", job.title);
  }

  return (
    <main className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <BriefcaseBusiness size={21} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Find Jobs
            </h1>
          </div>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Discover opportunities, explore AI resume matches, and save
            the jobs you want to revisit.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadJobs(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Jobs
        </button>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available jobs
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : jobs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Matching filters
          </p>
          <p className="mt-2 text-3xl font-bold text-violet-700">
            {loading ? "—" : filteredJobs.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Saved jobs
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {savedIds.size}
          </p>
        </div>
      </section>

      {/* Filters */}
      <JobFilters
        search={search}
        onSearchChange={setSearch}
        location={location}
        onLocationChange={setLocation}
        jobType={jobType}
        onJobTypeChange={setJobType}
        minMatch={minMatch}
        onMinMatchChange={setMinMatch}
        onReset={resetFilters}
      />

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => loadJobs()}
            className="shrink-0 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Job opportunities
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading available jobs..."
              : `${filteredJobs.length} result${filteredJobs.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
          <Sparkles size={14} />
          AI-powered matching
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
              <div className="mt-6 h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
              <div className="mt-6 h-10 w-32 rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredJobs.map((job, index) => {
            const jobId = getJobId(job);

            return (
              <div key={`${jobId}-${index}`} className="relative">
                <JobCard
                  job={job}
                  onSave={toggleSavedJob}
                  onApply={handleApply}
                />

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  <Search size={15} />
                  View full details
                </button>

                {savedIds.has(jobId) && (
                  <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    Saved
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <Search size={25} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {jobs.length === 0
              ? "No jobs available yet"
              : "No jobs match your filters"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {jobs.length === 0
              ? "The backend returned no job listings. Check your job-fetching service or try refreshing."
              : "Try changing your keywords, location, employment type, or minimum match score."}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>

            <button
              type="button"
              onClick={() => loadJobs(true)}
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Refresh jobs
            </button>
          </div>
        </section>
      )}

      <JobDetailsModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
      />
    </main>
  );
}
