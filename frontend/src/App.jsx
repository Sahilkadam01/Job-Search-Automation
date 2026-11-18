
import { useEffect, useState } from "react";

import AppLayout from "./components/layout/AppLayout";
import AuthPage from "./components/auth/AuthPage";

import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

import api, { checkBackendHealth } from "./services/api";

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

      <h2 className="mt-5 text-2xl font-bold text-slate-900">{page}</h2>

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
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function initializeApp() {
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

      const token = localStorage.getItem("access_token");

      if (!token) {
        if (!cancelled) {
          setAuthChecking(false);
        }
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (!cancelled) {
          setUser(response.data);
        }
      } catch {
        localStorage.removeItem("access_token");

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthChecking(false);
        }
      }
    }

    initializeApp();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleAuthSuccess(authenticatedUser) {
    setUser(authenticatedUser);
    setActivePage("Dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("access_token");
    setUser(null);
    setActivePage("Dashboard");
  }

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

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-5 py-2">
        <span className="text-sm text-slate-600">
          Welcome, <strong>{user.name}</strong>
        </span>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      <AppLayout
        activePage={activePage}
        onNavigate={setActivePage}
        backendStatus={backendStatus}
      >
        {renderPage()}
      </AppLayout>
    </div>
  );
}
