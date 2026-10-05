import {
  BriefcaseBusiness,
  Target,
  FileText,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            AI Job Hunter
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Find your next opportunity faster.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Upload your resume, search jobs, and use AI to discover
            opportunities that match your skills and experience.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Upload Resume
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Find Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          title="Jobs Found"
          value="0"
          description="Available opportunities"
        />

        <StatCard
          icon={Target}
          title="Strong Matches"
          value="0"
          description="70%+ match score"
        />

        <StatCard
          icon={FileText}
          title="Applications"
          value="0"
          description="Tracked applications"
        />

        <StatCard
          icon={TrendingUp}
          title="Average Match"
          value="0%"
          description="Your average score"
        />
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Get started
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            number="01"
            title="Upload your resume"
            description="Let AI understand your skills and experience."
            to="/resume"
          />

          <QuickAction
            number="02"
            title="Search for jobs"
            description="Find relevant opportunities from job boards."
            to="/jobs"
          />

          <QuickAction
            number="03"
            title="Track applications"
            description="Keep your entire job search organized."
            to="/applications"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  number,
  title,
  description,
  to,
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <span className="text-xs font-bold text-blue-600">
        {number}
      </span>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
        Open
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

export default Dashboard;