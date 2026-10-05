import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="lg:pl-64">
        <Header />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;