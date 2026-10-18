
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export default function JobFilters({
  search = "",
  onSearchChange,
  location = "",
  onLocationChange,
  jobType = "",
  onJobTypeChange,
  minMatch = 0,
  onMinMatchChange,
  onReset,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">Filter opportunities</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Find jobs that fit your preferences
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-600">
            Search jobs
          </span>
          <div className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Job title or company"
              className={`${inputClass} pl-10`}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-600">
            Location
          </span>
          <input
            type="text"
            value={location}
            onChange={(event) => onLocationChange?.(event.target.value)}
            placeholder="e.g. Gurugram, Remote"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-slate-600">
            Employment type
          </span>
          <select
            value={jobType}
            onChange={(event) => onJobTypeChange?.(event.target.value)}
            className={inputClass}
          >
            <option value="">All types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            Minimum AI match
            <span className="rounded-md bg-violet-50 px-2 py-1 font-bold text-violet-700">
              {minMatch}%
            </span>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minMatch}
            onChange={(event) =>
              onMinMatchChange?.(Number(event.target.value))
            }
            className="mt-3 w-full cursor-pointer accent-violet-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </label>
      </div>
    </section>
  );
}
