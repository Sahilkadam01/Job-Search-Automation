
import { useState, useEffect } from "react";
import AuthPage from "./components/auth/AuthPage";
import api from "./services/api";

// Keep your existing page and layout imports.

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

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

        // Clear only when the server confirms the token is invalid.
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

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#315b96]" />
          <p className="mt-4 text-sm text-gray-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // IMPORTANT:
  // Keep your existing AppLayout and page rendering here.
  // Pass handleLogout to your logout button.

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;
