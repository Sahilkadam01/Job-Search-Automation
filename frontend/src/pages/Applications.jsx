
import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  Send,
  Clock3,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CalendarDays,
  Filter,
  FileText,
} from "lucide-react";

const initialApplications = [
  {
    id: 1,
    role: "Frontend Developer",
    company: "Example Technology",
    location: "Remote",
    appliedDate: "2026-10-10",
    status: "Applied",
    url: "",
  },
  {
    id: 2,
    role: "React Developer",
    company: "Sample Digital",
    location: "Gurugram, India",
    appliedDate: "2026-10-08",
    status: "Interview",
    url: "",
  },
  {
    id: 3,
    role: "Software Engineer",
    company: "Demo Systems",
    location: "New Delhi, India",
    appliedDate: "2026-10-05",
    status: "Under Review",
    url: "",
  },
];

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Interview: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Under Review": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  Offered: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        statusStyles[status] || "bg-slate-100 text-slate-600 ring-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function safeExternalUrl(url) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol)
      ? parsed.href
      : "";
  } catch {
    return "";
  }
}

export default function Applications() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const statuses = [
    "All",
    "Applied",
    "Under Review",
    "Interview",
    "Offered",
    "Rejected",
  ];

  const counts = useMemo(
    () => ({
      total: applications.length,
      applied: applications.filter((item) => item.status === "Applied").length,
      interview: applications.filter((item) => item.status === "Interview").length,
      offered: applications.filter((item) => item.status === "Offered").length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesSearch =
        !term ||
        `${item.role} ${item.company} ${item.location}`
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const updateStatus = (id, status) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
          <BriefcaseBusiness size={16} />
          Career workspace
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Applications
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Organize your applications and keep track of each opportunity
          throughout your job search.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total applications"
          value={counts.total}
          icon={FileText}
          color="bg-violet-100 text-violet-700"
        />
        <SummaryCard
          title="Applied"
          value={counts.applied}
          icon={Send}
          color="bg-blue-100 text-blue-700"
        />
        <SummaryCard
          title="Interviews"
          value={counts.interview}
          icon={CalendarDays}
          color="bg-emerald-100 text-emerald-700"
        />
        <SummaryCard
          title="Offers"
          value={counts.offered}
          icon={CheckCircle2}
          color="bg-amber-100 text-amber-700"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-violet-700" />
          <h2 className="font-semibold text-slate-900">
            Manage applications
          </h2>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search job title, company, or location..."
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="min-w-36 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-4 font-semibold">Position</th>
                <th className="px-3 py-4 font-semibold">Applied date</th>
                <th className="px-3 py-4 font-semibold">Status</th>
                <th className="px-3 py-4 font-semibold">Update status</th>
                <th className="px-3 py-4 font-semibold">Link</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((item) => {
                const url = safeExternalUrl(item.url);

                return (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-3 py-5">
                      <p className="font-semibold text-slate-800">
                        {item.role}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.company}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.location}
                      </p>
                    </td>

                    <td className="px-3 py-5 text-sm text-slate-600">
                      {item.appliedDate}
                    </td>

                    <td className="px-3 py-5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-3 py-5">
                      {editingId === item.id ? (
                        <select
                          autoFocus
                          aria-label={`Update status for ${item.role}`}
                          defaultValue={item.status}
                          onChange={(event) =>
                            updateStatus(item.id, event.target.value)
                          }
                          onBlur={() => setEditingId(null)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-violet-400"
                        >
                          {statuses
                            .filter((status) => status !== "All")
                            .map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingId(item.id)}
                          className="text-xs font-semibold text-violet-700 hover:text-violet-900"
                        >
                          Edit status
                        </button>
                      )}
                    </td>

                    <td className="px-3 py-5">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${item.role} job link`}
                          className="inline-flex rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <ExternalLink size={17} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                <Clock3 size={23} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No applications found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or status filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 pb-2 text-xs text-slate-400">
        <XCircle size={14} />
        Demo records only. Changes are temporary and will reset on refresh.
      </p>
    </div>
  );
}
