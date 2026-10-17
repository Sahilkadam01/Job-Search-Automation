
import { useEffect, useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

import { checkBackendHealth } from "./services/api";

function PlaceholderPage({ page, onNavigate }) {
  const descriptions = {
    "Find Jobs": "Discover opportunities that match your resume.",
    "My Resume": "Upload your resume and prepare your profile.",
    Applications: "Track your job applications and their progress.",
    Settings: "Manage your job search preferences.",
  };

  return (
    <section className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
        ✦
      </div>

      <h2 className="mt-5 text-2xl font-bold text-slate-900">
        {page}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {descriptions[page] || "This section is coming soon."}
      </p>

      <button
        type="button"
        onClick={() => onNavigate("Dashboard")}
        className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        Back to Dashboard
      </button>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    async function verifyBackend() {
      try {
        await checkBackendHealth();

        if (!cancelled) {
          setBackendStatus("connected");
        }
      } catch {
        if (!cancelled) {
          setBackendStatus("disconnected");
        }
      }
    }

    verifyBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard onNavigate={setActivePage} />;

      case "Find Jobs":
        return <FindJobs />;

      case "My Resume":
        return <Resume />;

      case "Applications":
        return <Applications />;

      case "Settings":
        return <Settings />;

      default:
        return (
          <PlaceholderPage
            page={activePage}
            onNavigate={setActivePage}
          />
        );
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      backendStatus={backendStatus}
    >
      {renderPage()}
    </AppLayout>
  );
}
