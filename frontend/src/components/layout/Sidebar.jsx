import {
  Activity,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Find Jobs", icon: Search },
  { label: "My Resume", icon: FileText },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Settings", icon: Settings },
];

export default function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onClose,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-200">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="font-bold tracking-tight text-slate-900">
                JobHunter
              </p>
              <p className="text-xs text-slate-500">
                AI career assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pb-2 pt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-1 overflow-y-auto px-4"
        >
          {navigation.map(({ label, icon: Icon }) => {
            const isActive = activePage === label;

            return (
              <button
                key={label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onNavigate(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={19} />
                <span>{label}</span>

                {label === "Find Jobs" && (
                  <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="m-4 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-4 text-white">
          <Sparkles size={20} />

          <p className="mt-3 text-sm font-semibold">
            Your next role awaits
          </p>

          <p className="mt-1 text-xs leading-5 text-white/80">
            Keep your resume updated to discover better-matched opportunities.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("My Resume")}
            className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Update resume
          </button>
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
              J
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Job Seeker
              </p>
              <p className="truncate text-xs text-slate-500">
                Career workspace
              </p>
            </div>

            <Activity size={17} className="text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}