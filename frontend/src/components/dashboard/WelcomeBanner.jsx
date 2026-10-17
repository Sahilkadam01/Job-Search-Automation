
import { ArrowRight, Sparkles, BriefcaseBusiness } from "lucide-react";

export default function WelcomeBanner({ onExploreJobs }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-violet-200 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-48 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative z-10 max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
          <Sparkles size={14} />
          AI-Powered Job Search
        </div>

        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          Your next opportunity
          <br />
          starts here.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
          Discover relevant jobs, match opportunities with your resume, and
          manage your job search from one place.
        </p>

        <button
          type="button"
          onClick={onExploreJobs}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-indigo-50"
        >
          <BriefcaseBusiness size={17} />
          Explore Jobs
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-10 hidden opacity-20 sm:block">
        <BriefcaseBusiness size={120} strokeWidth={1} />
      </div>
    </section>
  );
}
