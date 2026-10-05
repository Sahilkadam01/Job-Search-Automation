import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Search,
  FileText,
  BriefcaseBusiness,
  Sparkles,
  Zap,
  Settings,
  X,
  Menu,
} from "lucide-react";

import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Find Jobs",
    path: "/jobs",
    icon: Search,
  },
  {
    name: "My Resume",
    path: "/resume",
    icon: FileText,
  },
  {
    name: "Applications",
    path: "/applications",
    icon: BriefcaseBusiness,
  },
  {
    name: "AI Resume",
    path: "/ai-resume",
    icon: Sparkles,
  },
  {
    name: "Automation",
    path: "/automation",
    icon: Zap,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function SidebarContent({ closeSidebar }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-6">
        <NavLink
          to="/"
          onClick={closeSidebar}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900">
              AI Job Hunter
            </h1>

            <p className="text-[11px] text-slate-500">
              Smart Job Search
            </p>
          </div>
        </NavLink>

        <button
          onClick={closeSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />

                  <span>{item.name}</span>

                  {item.name === "AI Resume" && (
                    <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                      AI
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Card */}
      <div className="p-4">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <Sparkles size={18} />
          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            Let AI find your next job
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Upload your resume and let AI match you with relevant jobs.
          </p>

          <NavLink
            to="/resume"
            onClick={closeSidebar}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Upload Resume
          </NavLink>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent closeSidebar={() => {}} />
      </aside>

      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="h-full w-72 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <SidebarContent closeSidebar={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;