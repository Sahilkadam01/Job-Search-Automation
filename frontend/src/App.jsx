import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowDownToLine, ArrowRight, Bell, BriefcaseBusiness, CheckCircle2,
  ChevronDown, CircleHelp, FileText, Gauge, Github, LayoutDashboard, Menu,
  Search, Settings2, Sparkles, Target, UploadCloud, UserRound, X, Zap
} from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Resume from "./pages/Resume.jsx";
import Applications from "./pages/Applications.jsx";
import { api, getErrorMessage } from "./api.js";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Find jobs", icon: BriefcaseBusiness },
  { to: "/resume", label: "Resume studio", icon: FileText },
  { to: "/applications", label: "Applications", icon: Target }
];

function Sidebar({ open, onClose, health }) {
  return <>
    {open && <button className="mobile-scrim" onClick={onClose} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><Sparkles size={19} /></div>
        <div><strong>jobhunter<span>.ai</span></strong><small>YOUR CAREER COPILOT</small></div>
        <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close sidebar"><X size={18}/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {navItems.map(({ to, label, icon: Icon, end }) =>
          <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18}/><span>{label}</span>{label === "Applications" && <span className="nav-live-dot" />}
          </NavLink>
        )}
      </nav>
      <div className="sidebar-bottom">
        <div className="quota-card">
          <div className="quota-icon"><Zap size={16}/></div>
          <strong>Smart job search</strong>
          <p>Search jobs, track progress, and keep your next move organized.</p>
          <div className="quota-status"><span className={`status-dot ${health ? "online" : "offline"}`}/>{health ? "API connected" : "API not connected"}</div>
        </div>
        <a className="nav-link subtle-link" href="https://fastapi.tiangolo.com/" target="_blank" rel="noreferrer"><CircleHelp size={18}/> <span>API documentation</span><ArrowDownToLine size={14}/></a>
        <div className="profile-mini">
          <div className="avatar">JH</div><div className="profile-copy"><strong>Job Hunter</strong><small>Personal workspace</small></div><Settings2 size={17} className="muted-icon"/>
        </div>
      </div>
    </aside>
  </>;
}

function Header({ onMenu }) {
  const location = useLocation();
  const page = navItems.find(n => n.to === location.pathname)?.label || "Workspace";
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open menu"><Menu size={20}/></button>
    <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
    <div className="topbar-actions">
      <div className="api-pill"><span className="status-dot pulse-dot"/> Local API</div>
      <button className="icon-button" title="Notifications"><Bell size={18}/></button>
      <div className="top-avatar">J</div>
    </div>
  </header>;
}

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [health, setHealth] = useState(false);
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    api.get("/health").then(() => { setHealth(true); setApiError(""); })
      .catch(error => { setHealth(false); setApiError(getErrorMessage(error)); });
  }, []);
  return <div className="app-shell">
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} health={health}/>
    <div className="main-shell">
      <Header onMenu={() => setSidebarOpen(true)}/>
      {apiError && <div className="connection-banner"><Activity size={16}/><span><strong>Backend not connected.</strong> {apiError} Start FastAPI, then refresh this page.</span><button onClick={() => api.get("/health").then(() => {setHealth(true);setApiError("");}).catch(e => setApiError(getErrorMessage(e)))}>Retry</button></div>}
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} className="page-content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22 }}>
          <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/jobs" element={<Jobs/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/applications" element={<Applications/>}/>
            <Route path="*" element={<Dashboard/>}/>
          </Routes>
        </motion.main>
      </AnimatePresence>
      <footer className="app-footer"><span>© {new Date().getFullYear()} JobHunter AI</span><span><span className={`status-dot ${health ? "online" : "offline"}`}/>{health ? "All systems operational" : "Waiting for backend"}</span></footer>
    </div>
  </div>;
}
export default App;