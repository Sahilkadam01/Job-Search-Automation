
import { useState, useEffect } from "react";

import AuthPage from "./components/auth/AuthPage";
import api from "./services/api";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [backendStatus, setBackendStatus] = useState("checking");

  // Verify login session
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (isMounted) setCheckingSession(false);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          timeout: 20000,
        });

        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        console.error(
          "Session validation failed:",
          error.response?.data || error.message
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("access_token");
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Check backend connection
  useEffect(() => {
    let isMounted = true;

    const checkBackend = async () => {
      try {
        await api.get("/health", { timeout: 15000 });

        if (isMounted) {
          setBackendStatus("connected");
        }
      } catch (error) {
        console.error("Backend health check failed:", error);

        if (isMounted) {
          setBackendStatus("disconnected");
        }
      }
    };

    checkBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  // Successful login or registration
  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage("Dashboard");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setActivePage("Dashboard");
  };

  // Session loading
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  // Authentication page
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Dashboard pages
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Find Jobs":
        return <FindJobs />;

      case "My Resume":
      case "Resume":
        return <Resume />;

      case "Applications":
        return <Applications />;

      case "Settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      backendStatus={backendStatus}
      user={user}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
