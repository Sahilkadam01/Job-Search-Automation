
import { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkX,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "ai-job-hunter-saved-jobs";

function getSavedJobs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getJobUrl(job) {
  const rawUrl = job?.url || job?.job_url || job?.apply_url || "";

  try {
    const parsed = new URL(rawUrl);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

export default function SavedJobs() {
  const [jobs, setJobs] = useState(getSavedJobs);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error("Unable to save bookmarked jobs:", error);
    }
  }, [jobs]);

  function removeJob(jobToRemove) {
    setJobs((current) =>
      current.filter((job) => {
        const jobId = job.id || job.job_id || job.url || job.job_url;
        const removeId =
          jobToRemove.id ||
          jobToRemove.job_id ||
          jobToRemove.url ||
          jobToRemove.job_url;

        return jobId !== removeId;
      })
    );
  }

  const filteredJobs = jobs.filter((job) => {
    const text = [
      job.title,
      job.company,
      job.company_name,
      job.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase().trim());
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="text-violet-600" size={23} />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Saved Jobs
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Keep interesting opportunities in one place.
          </p>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
          <p className="text-xs font-medium text-violet-600">Total saved</p>
          <p className="mt-1 text-2xl font-bold text-violet-800">
            {jobs.length}
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-violet-400">
        <Search size={19} className="shrink-0 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search saved jobs or companies..."
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </label>

      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            {jobs.length === 0 ? (
              <Bookmark size={25} />
            ) : (
              <Search size={25} />
            )}
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {jobs.length === 0
              ? "No saved jobs yet"
              : "No matching jobs found"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {jobs.length === 0
              ? "Browse job listings and save opportunities you want to revisit."
              : "Try a different keyword or company name."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredJobs.map((job, index) => {
            const title = job.title || "Untitled Position";
            const company =
              job.company || job.company_name || "Company not specified";
            const url = getJobUrl(job);
            const key =
              job.id ||
              job.job_id ||
              job.url ||
              job.job_url ||
              `${title}-${company}-${index}`;

            return (
              <article
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{company}</p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Sparkles size={12} />
                    {Number(job.match_score ?? 0)}%
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={15} />
                  {job.location || "Location not specified"}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                      View Job
                      <ExternalLink size={15} />
                    </a>
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
                      Application link unavailable
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeJob(job)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <BookmarkX size={16} />
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
