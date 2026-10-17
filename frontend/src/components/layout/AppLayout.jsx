import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({
  activePage,
  onNavigate,
  backendStatus,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavigate(page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Topbar
          activePage={activePage}
          backendStatus={backendStatus}
          onOpenMenu={() => setMobileOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}