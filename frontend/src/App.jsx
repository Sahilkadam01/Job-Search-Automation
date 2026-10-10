import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import FindJobs from "./pages/FindJobs";
import Resume from "./pages/Resume";
import Applications from "./pages/Applications";
import AIResume from "./pages/AIResume";
import Automation from "./pages/Automation";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<FindJobs />} />
          <Route path="resume" element={<Resume />} />
          <Route path="applications" element={<Applications />} />
          <Route path="ai-resume" element={<AIResume />} />
          <Route path="automation" element={<Automation />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;