
import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  Bookmark,
  Sparkles,
} from "lucide-react";

export default function JobCard({
  job,
  onSave,
  onApply,
}) {
  const title = job?.title || "Untitled Position";
  const company = job?.company || job?.company_name || "Company not specified";
  const location = job?.location || "Location not specified";
  const jobType = job?.job_type || job?.employment_type || "Full-time";
  const matchScore = Number(job?.match_score ?? 0);
  const jobUrl = job?.url || job?.job_url || job?.apply_url || "";

  const safeUrl = (() => {
    try {
      const parsed = new URL(jobUrl);
      return ["https:", "http:"].includes(parsed.protocol)
        ? parsed.href
        : "";
    } catch {
      return "";
    }
  })();

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">
          <BriefcaseBusiness size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-base font-bold text-slate-900 transition group-hover:text-violet-700 sm:text-lg">
                {title}
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {company}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
              <Sparkles size={13} />
              {matchScore}% match
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} />
              {location}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness size={15} />
              {jobType}
            </span>

            {job?.posted_date && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} />
                {job.posted_date}
              </span>
            )}
          </div>

          {job?.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
              {job.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onSave?.(job)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Bookmark size={16} />
              Save job
            </button>

            {safeUrl ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onApply?.(job)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                View & Apply
                <ExternalLink size={15} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                title="This job does not have a valid application link"
              >
                Link unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
