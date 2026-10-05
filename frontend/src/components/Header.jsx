import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const pageTitles = {
  "/": {
    title: "Dashboard",
    description: "Overview of your job hunting activity",
  },
  "/jobs": {
    title: "Find Jobs",
    description: "Discover jobs matched to your skills",
  },
  "/resume": {
    title: "My Resume",
    description: "Upload and manage your resume",
  },
  "/applications": {
    title: "Applications",
    description: "Track your job applications",
  },
  "/ai-resume": {
    title: "AI Resume",
    description: "Create a job-specific optimized resume",
  },
  "/automation": {
    title: "Automation",
    description: "Automate your job search workflow",
  },
  "/settings": {
    title: "Settings",
    description: "Manage your application preferences",
  },
};

function Header() {
  const location = useLocation();

  const currentPage =
    pageTitles[location.pathname] || pageTitles["/"];

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="ml-12 lg:ml-0">
          <h2 className="text-lg font-bold text-slate-900">
            {currentPage.title}
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            {currentPage.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search */}
          <button className="hidden rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 sm:block">
            <Search size={18} />
          </button>

          {/* Notification */}
          <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
          </button>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            SK
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;