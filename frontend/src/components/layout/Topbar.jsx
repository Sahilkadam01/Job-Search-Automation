import { Menu, Settings } from "lucide-react";

export default function Topbar({
  activePage,
  backendStatus = "checking",
  onOpenMenu,
  onNavigate,
}) {
  const statusStyles = {
    checking: "border-amber-200 bg-amber-50 text-amber-700",
    connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
    disconnected: "border-red-200 bg-red-50 text-red-700",
  };

  const statusLabels = {
    checking: "Checking backend",
    connected: "Backend connected",
    disconnected: "Backend disconnected",
  };

  const dotStyles = {
    checking: "bg-amber-500",
    connected: "bg-emerald-500",
    disconnected: "bg-red-500",
  };

  const status = statusStyles[backendStatus]
    ? backendStatus
    : "checking";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            Workspace
          </p>
          <h1 className="truncate text-lg font-bold text-slate-900">
            {activePage}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          role="status"
          aria-live="polite"
          className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:flex ${statusStyles[status]}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${dotStyles[status]}`}
          />
          {statusLabels[status]}
        </div>

        <button
          type="button"
          onClick={() => onNavigate("Settings")}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Settings size={17} />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
}