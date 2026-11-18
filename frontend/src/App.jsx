
import { useState, useEffect } from "react";

import AuthPage from "./components/auth/AuthPage";
import api from "./services/api";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  // Check existing login session
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (isMounted) {
          setCheckingSession(false);
        }
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

  // Login / Register success
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

  // Loading screen
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

  // Show authentication page
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Render selected page
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Find Jobs":
        return <FindJobs />;

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

  // Authenticated application
  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={handleLogout}
      user={user}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
