
import { useEffect } from "react";
import {
  X,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  ExternalLink,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  onApply,
}) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const title = job.title || "Untitled Position";
  const company =
    job.company || job.company_name || "Company not specified";
  const location = job.location || "Location not specified";
  const jobType = job.job_type || job.employment_type || "Not specified";
  const matchScore = Math.min(
    100,
    Math.max(0, Number(job.match_score ?? 0))
  );

  const rawUrl = job.url || job.job_url || job.apply_url || "";

  let safeUrl = "";

  try {
    const parsedUrl = new URL(rawUrl);

    if (["https:", "http:"].includes(parsedUrl.protocol)) {
      safeUrl = parsedUrl.href;
    }
  } catch {
    safeUrl = "";
  }

  const skills = Array.isArray(job.required_skills)
    ? job.required_skills
    : Array.isArray(job.skills)
      ? job.skills
      : [];

  const description =
    job.description || "No job description is available for this listing.";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 px-6 py-7 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition hover:bg-white/25"
          >
            <X size={19} />
          </button>

          <div className="relative flex items-start gap-4 pr-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
              <Building2 size={27} />
            </div>

            <div className="min-w-0">
              <h2
                id="job-details-title"
                className="break-words text-xl font-bold leading-snug sm:text-2xl"
              >
                {title}
              </h2>

              <p className="mt-2 text-sm font-medium text-white/85">
                {company}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {location}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusiness size={14} />
                  {jobType}
                </span>

                {job.posted_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {job.posted_date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-7 p-6 sm:p-8">
          <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Sparkles size={17} className="text-violet-600" />
                  AI Resume Match
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Match score provided by the job-matching service
                </p>
              </div>

              <span className="text-2xl font-extrabold text-violet-700">
                {matchScore}%
              </span>
            </div>

            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-violet-100"
              role="progressbar"
              aria-label="AI resume match"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={matchScore}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Job Description
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {description}
            </p>
          </div>

          {skills.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Required Skills
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={`${String(skill)}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                  >
                    <CheckCircle2 size={13} />
                    {String(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>

            {safeUrl ? (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onApply?.(job)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Apply for this Job
                <ExternalLink size={16} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                Application link unavailable
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
