import { useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Find Jobs", icon: Search },
  { label: "My Resume", icon: FileText },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Settings", icon: Settings },
];

const stats = [
  {
    label: "Jobs discovered",
    value: "128",
    change: "+12% this week",
    icon: BriefcaseBusiness,
    color: "bg-violet-100 text-violet-600",
  },
  {
    label: "Matched to you",
    value: "36",
    change: "Based on your profile",
    icon: Target,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Applications sent",
    value: "14",
    change: "Across your job search",
    icon: TrendingUp,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Profile strength",
    value: "82%",
    change: "Keep improving",
    icon: Activity,
    color: "bg-amber-100 text-amber-600",
  },
];

const demoJobs = [
  {
    company: "TechNova",
    role: "Frontend Developer",
    location: "Remote · India",
    type: "Full-time",
    match: 96,
    color: "bg-violet-100 text-violet-700",
    logo: "T",
  },
  {
    company: "PixelCraft",
    role: "React Developer",
    location: "Gurugram, Haryana",
    type: "Hybrid",
    match: 91,
    color: "bg-blue-100 text-blue-700",
    logo: "P",
  },
  {
    company: "CloudAxis",
    role: "Junior Software Engineer",
    location: "Remote · India",
    type: "Full-time",
    match: 87,
    color: "bg-emerald-100 text-emerald-700",
    logo: "C",
  },
];

function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200">
              <Sparkles size={21} />
            </div>
            <div>
              <p className="font-bold tracking-tight text-slate-900">
                JobHunter
              </p>
              <p className="text-xs text-slate-500">AI career assistant</p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pb-2 pt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActivePage(label);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                activePage === label
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={19} />
              {label}
              {label === "Find Jobs" && (
                <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                  AI
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="m-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-4 text-white">
          <Sparkles size={20} />
          <p className="mt-3 text-sm font-semibold">Your next role awaits</p>
          <p className="mt-1 text-xs leading-5 text-white/80">
            Keep your resume updated to discover better-matched opportunities.
          </p>
          <button
            onClick={() => setActivePage("My Resume")}
            className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Update resume
          </button>
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Job Seeker
              </p>
              <p className="truncate text-xs text-slate-500">
                Career workspace
              </p>
            </div>
            <ChevronDown size={17} className="text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-100/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {stat.value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${stat.color}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{stat.change}</p>
    </article>
  );
}

function DashboardContent({ setActivePage }) {
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-blue-600 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
            <Sparkles size={14} />
            Your AI-powered job search
          </div>
          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
            Find opportunities that
            <br className="hidden sm:block" /> fit your next chapter.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Discover relevant roles, evaluate your resume match, and organize
            your job search from one workspace.
          </p>
          <button
            onClick={() => setActivePage("Find Jobs")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            <Search size={17} />
            Explore jobs
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Your job search at a glance
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              A quick overview of your career activity.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            Sample dashboard data
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-100/70">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h3 className="font-bold text-slate-900">Recommended opportunities</h3>
            <p className="mt-1 text-sm text-slate-500">
              Example roles to preview the interface.
            </p>
          </div>
          <button
            onClick={() => setActivePage("Find Jobs")}
            className="text-sm font-semibold text-violet-700 hover:text-violet-900"
          >
            View all jobs →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {demoJobs.map((job) => (
            <div
              key={job.company}
              className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:px-6"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${job.color}`}>
                {job.logo}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-900">{job.role}</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {job.company} <span className="mx-1">·</span> {job.location}
                </p>
                <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {job.type}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-emerald-600">
                    {job.match}%
                  </p>
                  <p className="text-xs text-slate-500">Sample match</p>
                </div>
                <button
                  onClick={() => setActivePage("Find Jobs")}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 pb-2 text-xs text-slate-400">
        <CircleHelp size={14} />
        Dashboard preview · Connect your backend to load real job data.
      </p>
    </div>
  );
}

function PlaceholderPage({ page, setActivePage }) {
  const descriptions = {
    "Find Jobs": "Search for roles and review opportunities matched to your resume.",
    "My Resume": "Upload your resume and prepare your profile for job matching.",
    Applications: "Track the status of the jobs you have applied to.",
    Settings: "Manage your job search preferences and automation settings.",
  };

  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        <Sparkles size={28} />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-slate-900">{page}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {descriptions[page] || "Your workspace is ready to configure."}
      </p>
      {page === "My Resume" && (
        <button
          onClick={() => window.alert("Resume upload will be added in the next step.")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <Upload size={17} />
          Prepare resume upload
        </button>
      )}
      <button
        onClick={() => setActivePage("Dashboard")}
        className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-900"
      >
        Back to dashboard
      </button>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Workspace</p>
              <h1 className="truncate text-lg font-bold text-slate-900">
                {activePage}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              UI ready
            </div>
            <button
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              onClick={() => setActivePage("Settings")}
            >
              <Settings size={17} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {activePage === "Dashboard" ? (
            <DashboardContent setActivePage={setActivePage} />
          ) : (
            <PlaceholderPage page={activePage} setActivePage={setActivePage} />
          )}
        </main>
      </div>
    </div>
  );
}