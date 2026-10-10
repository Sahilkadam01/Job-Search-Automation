import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  LayoutDashboard,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  UploadCloud,
  X
} from "lucide-react";

import {
  api,
  listOf,
  titleOf,
  companyOf,
  locationOf,
  linkOf,
  scoreOf
} from "./services/api.js";

const pages = [
  ["Dashboard", LayoutDashboard],
  ["Find Jobs", Search],
  ["My Resume", FileText],
  ["Applications", BriefcaseBusiness],
  ["AI Resume", Sparkles],
  ["Automation", Bot],
  ["Settings", SettingsIcon]
];

function StatCard({ label, value, hint, icon: Icon, color = "violet" }) {
  const colors = {
    violet: "bg-violet-400/10 text-violet-300",
    blue: "bg-sky-400/10 text-sky-300",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300"
  };

  return (
    <div className="panel p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#9999ad]">{label}</p>
          <p className="mt-3 text-3xl font-extrabold">{value}</p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            colors[color] || colors.violet
          }`}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[#77778d]">{hint}</p>
    </div>
  );
}

function JobList({ jobs }) {
  if (!jobs.length) {
    return (
      <div className="p-10 text-center">
        <Search className="mx-auto text-[#77778d]" size={28} />
        <p className="mt-3 font-semibold">No jobs found</p>
        <p className="mt-1 text-sm text-[#85859b]">
          Try refreshing or check whether your backend has job data.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[.06]">
      {jobs.map((job, index) => {
        const url = linkOf(job);
        const score = scoreOf(job);

        return (
          <div
            key={job.id ?? job.job_id ?? `${companyOf(job)}-${index}`}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 font-bold text-violet-300">
              {companyOf(job).slice(0, 1).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {titleOf(job)}
              </p>
              <p className="mt-1 truncate text-xs text-[#85859b]">
                {companyOf(job)} · {locationOf(job)}
              </p>
            </div>

            {score !== null && (
              <span className="w-fit rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300">
                {score}% match
              </span>
            )}

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="secondary text-xs"
              >
                View job <ExternalLink size={13} />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close menu overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-white/[.07] bg-[#0d0d16] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/[.07] px-5">
          <button
            onClick={() => onNavigate("Dashboard")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-500 to-indigo-600">
              <Bot size={23} />
            </span>

            <span>
              <strong className="block text-[15px]">
                JobHunter <span className="text-violet-400">AI</span>
              </strong>
              <small className="mt-1 block text-[11px] text-[#88889d]">
                Your career copilot
              </small>
            </span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="text-[#9999ad] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-5 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[.2em] text-[#65657b]">
          Workspace
        </p>

        <nav className="flex-1 space-y-1 px-3">
          {pages.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => onNavigate(name)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-semibold transition ${
                active === name
                  ? "bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-400/20"
                  : "text-[#9a9aad] hover:bg-white/[.045] hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{name}</span>
              {active === name && (
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="m-4 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-indigo-500/[.06] p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
            <Sparkles size={18} />
          </div>
          <p className="text-sm font-bold">Make your next move</p>
          <p className="mt-1.5 text-xs leading-5 text-[#9999ad]">
            Keep your job search focused and your applications organized.
          </p>
          <button
            onClick={() => onNavigate("Find Jobs")}
            className="mt-3 w-full rounded-xl bg-violet-500/15 py-2.5 text-xs font-bold text-violet-300 hover:bg-violet-500/25"
          >
            Explore opportunities ↗
          </button>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);
  const [notice, setNotice] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [busy, setBusy] = useState("");

  const notify = (type, message) => {
    setNotice({
      type,
      message: String(message || "Request completed.")
    });
  };

  const checkHealth = useCallback(async () => {
    try {
      await api.health();
      setBackendStatus(true);
    } catch {
      setBackendStatus(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.getJobs(),
        api.getApplications()
      ]);

      if (results[0].status === "fulfilled") {
        setJobs(listOf(results[0].value, ["jobs"]));
      }

      if (results[1].status === "fulfilled") {
        setApplications(listOf(results[1].value, ["applications"]));
      }

      if (results.every((result) => result.status === "rejected")) {
        throw results[0].reason;
      }
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadData();
  }, [checkHealth, loadData]);

  const navigate = (page) => {
    setActive(page);
    setMenuOpen(false);
    setNotice(null);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = [
        titleOf(job),
        companyOf(job),
        locationOf(job),
        job?.description || ""
      ]
        .join(" ")
        .toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        locationOf(job).toLowerCase().includes(locationFilter.toLowerCase())
      );
    });
  }, [jobs, search, locationFilter]);

  async function uploadResume() {
    if (!file) {
      notify("error", "Please select a PDF resume first.");
      return;
    }

    setUploading(true);

    try {
      const result = await api.uploadResume(file);
      setUploadResult(result);
      notify("success", result?.message || "Resume upload completed.");
    } catch (error) {
      notify("error", error.message);
    } finally {
      setUploading(false);
    }
  }

  async function runAction(name, action) {
    setBusy(name);

    try {
      const result = await action();
      notify("success", result?.message || `${name} request completed.`);
      await loadData();
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy("");
    }
  }

  function pageContent() {
    switch (active) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[24px] border border-violet-400/20 bg-gradient-to-br from-[#241747] via-[#17132d] to-[#10101a] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[.08] px-3 py-1.5 text-[11px] font-semibold text-violet-200">
                    <Sparkles size={14} /> AI-POWERED CAREER WORKSPACE
                  </span>

                  <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-[38px]">
                    Your next opportunity starts here.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#b3adc9]">
                    Discover relevant roles, review your resume, and organize
                    your job search in one workspace.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate("Find Jobs")}
                      className="primary"
                    >
                      Find jobs <ArrowUpRight size={16} />
                    </button>
                    <button
                      onClick={() => navigate("My Resume")}
                      className="secondary"
                    >
                      Upload resume <FileText size={16} />
                    </button>
                  </div>
                </div>

                <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-[30px] border border-white/10 bg-white/[.035] md:flex">
                  <Activity size={60} className="text-violet-300" />
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Jobs loaded"
                value={loading ? "…" : jobs.length}
                hint="Jobs returned by your API"
                icon={Search}
              />
              <StatCard
                label="Applications"
                value={loading ? "…" : applications.length}
                hint="Records returned by your API"
                icon={BriefcaseBusiness}
                color="blue"
              />
              <StatCard
                label="Jobs with match scores"
                value={jobs.filter((job) => scoreOf(job) !== null).length}
                hint="Scores present in API data"
                icon={Sparkles}
                color="green"
              />
              <StatCard
                label="Backend"
                value={backendStatus === true ? "Online" : backendStatus === false ? "Offline" : "…"}
                hint="FastAPI health endpoint"
                icon={Bot}
                color={backendStatus ? "green" : "amber"}
              />
            </div>

            <section className="panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] px-5 py-5">
                <div>
                  <h3 className="font-bold">Recent job opportunities</h3>
                  <p className="mt-1 text-xs text-[#818197]">
                    Latest jobs returned by your backend
                  </p>
                </div>

                <button
                  className="secondary text-xs"
                  onClick={loadData}
                  disabled={loading}
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {loading ? (
                <p className="p-8 text-center text-sm muted">Loading jobs…</p>
              ) : (
                <JobList jobs={jobs.slice(0, 5)} />
              )}
            </section>
          </div>
        );

      case "Find Jobs":
        return (
          <div className="space-y-5">
            <section className="panel p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-300">
                    Opportunity explorer
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">
                    Find your next role
                  </h2>
                  <p className="mt-2 text-sm muted">
                    Search through the jobs returned by your backend.
                  </p>
                </div>

                <button
                  className="primary"
                  disabled={Boolean(busy)}
                  onClick={() =>
                    runAction("Matching", () => api.matchAllJobs())
                  }
                >
                  <Sparkles size={16} />
                  {busy === "Matching" ? "Matching…" : "Match all jobs"}
                </button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <label className="relative block">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77778d]"
                  />
                  <input
                    className="field pl-10"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Role, company, or keyword"
                  />
                </label>

                <label className="relative block">
                  <MapPin
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77778d]"
                  />
                  <input
                    className="field pl-10"
                    value={locationFilter}
                    onChange={(event) => setLocationFilter(event.target.value)}
                    placeholder="Filter by location"
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#77778d]">
                <span>
                  {filteredJobs.length} of {jobs.length} jobs shown
                </span>
                <button
                  className="secondary"
                  onClick={loadData}
                  disabled={loading}
                >
                  <RefreshCw size={14} /> Reload
                </button>
              </div>
            </section>

            <section className="panel overflow-hidden">
              {loading ? (
                <p className="p-8 text-center text-sm muted">Loading jobs…</p>
              ) : (
                <JobList jobs={filteredJobs} />
              )}
            </section>
          </div>
        );

      case "My Resume":
        return (
          <div className="mx-auto max-w-4xl space-y-5">
            <section className="panel p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-300">
                    Candidate profile
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">My resume</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 muted">
                Select a PDF resume to send to your FastAPI upload endpoint.
              </p>

              <div className="mt-7 rounded-2xl border border-dashed border-violet-400/30 bg-violet-400/[.035] p-7 text-center sm:p-10">
                <UploadCloud className="mx-auto text-violet-300" size={35} />
                <h3 className="mt-4 font-bold">Upload your resume</h3>
                <p className="mt-2 text-sm muted">
                  PDF format only
                </p>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="field mt-5"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (!selected) return;

                    if (
                      selected.type !== "application/pdf" &&
                      !selected.name.toLowerCase().endsWith(".pdf")
                    ) {
                      notify("error", "Please select a PDF file.");
                      return;
                    }

                    setFile(selected);
                    setUploadResult(null);
                  }}
                />

                {file && (
                  <p className="mt-3 break-all text-sm text-violet-200">
                    Selected: {file.name}
                  </p>
                )}

                <button
                  className="primary mt-5"
                  onClick={uploadResume}
                  disabled={uploading || !file}
                >
                  {uploading ? "Uploading…" : "Upload resume"}
                </button>
              </div>
            </section>

            {uploadResult && (
              <section className="panel p-5">
                <h3 className="font-bold text-emerald-300">
                  <CheckCircle2 className="mr-2 inline" size={18} />
                  Backend response
                </h3>
                <pre className="mt-4 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-black/20 p-4 text-xs leading-5 text-[#c7c7d5]">
                  {JSON.stringify(uploadResult, null, 2)}
                </pre>
              </section>
            )}
          </div>
        );

      case "Applications":
        return (
          <section className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] p-5">
              <div>
                <h2 className="text-xl font-extrabold">Applications</h2>
                <p className="mt-1 text-sm muted">
                  Application records returned by your backend.
                </p>
              </div>
              <button className="secondary" onClick={loadData} disabled={loading}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            {loading ? (
              <p className="p-8 text-center text-sm muted">
                Loading applications…
              </p>
            ) : applications.length === 0 ? (
              <div className="p-10 text-center">
                <BriefcaseBusiness className="mx-auto text-[#77778d]" size={28} />
                <p className="mt-3 font-semibold">No applications returned</p>
                <p className="mt-1 text-sm muted">
                  Application records will appear here when available from the API.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[.06]">
                {applications.map((application, index) => (
                  <div
                    key={application.id ?? application.application_id ?? index}
                    className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {titleOf(application)}
                      </p>
                      <p className="mt-1 text-xs muted">
                        {companyOf(application)}
                      </p>
                    </div>
                    <span className="w-fit rounded-lg bg-violet-400/10 px-3 py-1.5 text-xs text-violet-300">
                      {application.status || application.application_status || "Saved"}
                    </span>
                    {linkOf(application) && (
                      <a
                        className="secondary text-xs"
                        href={linkOf(application)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case "Automation":
        return (
          <div className="space-y-5">
            <section className="panel p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                <Bot size={25} />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold">
                Automation center
              </h2>
              <p className="mt-2 text-sm leading-6 muted">
                Run automation operations exposed by your backend. Scheduled
                execution is managed by your backend scheduler, not this page.
              </p>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="panel p-6">
                <RefreshCw className="text-sky-300" size={23} />
                <h3 className="mt-4 font-bold">Auto-save jobs</h3>
                <p className="mt-2 text-sm leading-6 muted">
                  Ask the backend to run its job auto-save operation.
                </p>
                <button
                  className="primary mt-5 w-full"
                  disabled={Boolean(busy)}
                  onClick={() =>
                    runAction("Auto-save", () => api.autoSaveJobs())
                  }
                >
                  {busy === "Auto-save" ? "Running…" : "Run auto-save"}
                </button>
              </section>

              <section className="panel p-6">
                <Sparkles className="text-violet-300" size={23} />
                <h3 className="mt-4 font-bold">Match all jobs</h3>
                <p className="mt-2 text-sm leading-6 muted">
                  Request resume-to-job matching for available jobs.
                </p>
                <button
                  className="primary mt-5 w-full"
                  disabled={Boolean(busy)}
                  onClick={() =>
                    runAction("Matching", () => api.matchAllJobs())
                  }
                >
                  {busy === "Matching" ? "Matching…" : "Run matching"}
                </button>
              </section>
            </div>

            <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-4">
              <Clock3 className="mr-2 inline text-amber-300" size={17} />
              <span className="text-sm font-semibold text-amber-200">
                Scheduled runs
              </span>
              <p className="mt-2 text-xs leading-5 text-[#b6a989]">
                A free Render web service may sleep or restart. Do not assume
                an in-process six-hour scheduler will run reliably while the
                service is asleep.
              </p>
            </div>
          </div>
        );

      case "AI Resume":
        return (
          <section className="panel mx-auto max-w-4xl p-6 sm:p-8">
            <Sparkles className="text-violet-300" size={28} />
            <h2 className="mt-5 text-2xl font-extrabold">AI Resume Studio</h2>
            <p className="mt-3 text-sm leading-6 muted">
              This workspace is prepared for your resume customization and
              generation endpoints. Inspect those FastAPI handlers before
              adding forms, because their required request fields must match
              the backend exactly.
            </p>
            <div className="mt-5 rounded-xl border border-sky-400/15 bg-sky-400/[.04] p-4 text-sm text-sky-200">
              <AlertCircle className="mr-2 inline" size={17} />
              Upload your base resume from the My Resume page first.
            </div>
          </section>
        );

      case "Settings":
        return (
          <div className="mx-auto max-w-4xl space-y-5">
            <section className="panel p-6">
              <SettingsIcon className="text-violet-300" size={25} />
              <h2 className="mt-4 text-2xl font-extrabold">Settings</h2>
              <p className="mt-2 text-sm muted">
                Manage your frontend-to-backend connection.
              </p>
            </section>

            <section className="panel p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold">Backend connection</h3>
                  <p className="mt-2 break-all text-xs muted">
                    {api.baseUrl}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    backendStatus === true
                      ? "bg-emerald-400/10 text-emerald-300"
                      : backendStatus === false
                        ? "bg-rose-400/10 text-rose-300"
                        : "bg-amber-400/10 text-amber-200"
                  }`}
                >
                  {backendStatus === true
                    ? "Connected"
                    : backendStatus === false
                      ? "Offline"
                      : "Checking"}
                </span>
              </div>

              <button
                className="secondary mt-5"
                onClick={checkHealth}
              >
                <RefreshCw size={15} /> Test connection
              </button>

              <p className="mt-5 text-xs leading-5 muted">
                For deployment, set VITE_API_BASE_URL in Vercel to your Render
                backend URL and redeploy. Configure FastAPI CORS to allow your
                frontend domain.
              </p>
            </section>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#09090f] text-[#f4f4f8]">
      <Sidebar
        active={active}
        onNavigate={navigate}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[.07] bg-[#09090f]/85 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-white/10 p-2 text-[#b6b6c7] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#69697f]">
                Workspace / {active}
              </p>
              <h1 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
                {active}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold sm:flex ${
                backendStatus === true
                  ? "border-emerald-500/20 bg-emerald-500/[.07] text-emerald-300"
                  : backendStatus === false
                    ? "border-rose-500/20 bg-rose-500/[.07] text-rose-300"
                    : "border-white/10 text-[#9999ad]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  backendStatus === true
                    ? "bg-emerald-400"
                    : backendStatus === false
                      ? "bg-rose-400"
                      : "bg-amber-300"
                }`}
              />
              {backendStatus === true
                ? "Backend connected"
                : backendStatus === false
                  ? "Backend offline"
                  : "Checking backend"}
            </div>

            <button
              aria-label="Refresh backend status"
              title="Refresh backend status"
              onClick={checkHealth}
              className="rounded-xl border border-white/10 p-2.5 text-[#9a9aad] hover:bg-white/[.05]"
            >
              <RefreshCw size={17} />
            </button>

            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-white/10 p-2.5 text-[#9a9aad] hover:bg-white/[.05]"
              onClick={() => notify("success", "You are all caught up.")}
            >
              <Bell size={18} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-500/30 text-xs font-extrabold text-violet-200 ring-1 ring-violet-400/20">
              AI
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {notice && (
            <div
              role="status"
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                notice.type === "success"
                  ? "border-emerald-500/20 bg-emerald-500/[.07] text-emerald-200"
                  : "border-rose-500/20 bg-rose-500/[.07] text-rose-200"
              }`}
            >
              {notice.type === "success" ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
              )}
              <span className="flex-1">{notice.message}</span>
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {pageContent()}

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-[#69697f]">
            <span>© {new Date().getFullYear()} AI Job Hunter</span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} /> Find better opportunities, with focus.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}