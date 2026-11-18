
import { Menu, Settings, LogOut } from "lucide-react";

export default function Topbar({
  activePage,
  backendStatus = "checking",
  onOpenMenu,
  onNavigate,
  user,
  onLogout,
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

  const displayName = user?.name || user?.email || "User";

  return (
    <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">

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

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">

        {/* Backend status */}
        <div
          role="status"
          aria-live="polite"
          className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:flex ${statusStyles[status]}`}
        >
          <span className={`h-2 w-2 rounded-full ${dotStyles[status]}`} />
          {statusLabels[status]}
        </div>

        {/* Welcome user */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="max-w-32">
            <p className="text-xs text-slate-400">
              Welcome back
            </p>

            <p className="truncate text-sm font-semibold text-slate-800">
              {displayName}
            </p>
          </div>
        </div>

        {/* Settings */}
        <button
          type="button"
          onClick={() => onNavigate("Settings")}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Settings size={17} />
          <span className="hidden sm:inline">Settings</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}