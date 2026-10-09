import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Search, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { api, getErrorMessage, unwrap } from "../api.js";
import { Badge, EmptyState, ErrorState, Loading, PageHeading, Panel, StatCard, formatDate, pick } from "../components/UI.jsx";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    const results = await Promise.allSettled([api.get("/jobs"), api.get("/applications")]);
    if (results[0].status === "fulfilled") {
      const d = unwrap(results[0].value.data); setJobs(Array.isArray(d) ? d : Array.isArray(d?.jobs) ? d.jobs : []);
    }
    if (results[1].status === "fulfilled") {
      const d = unwrap(results[1].value.data); setApps(Array.isArray(d) ? d : Array.isArray(d?.applications) ? d.applications : []);
    }
    if (results.every(r => r.status === "rejected")) setError(getErrorMessage(results[0].reason));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const interviews = apps.filter(a => /interview|offer/i.test(String(a.status || ""))).length;
  const applied = apps.filter(a => !/saved|bookmarked/i.test(String(a.status || ""))).length;
  const recentJobs = useMemo(() => jobs.slice(0, 5), [jobs]);
  return <>
    <PageHeading eyebrow="YOUR CAREER, IN ONE PLACE" title={<>Your next opportunity<br/><span className="gradient-text">starts here.</span></>} description="A focused workspace to discover roles, tailor your resume, and stay on top of every application." action={<Link to="/jobs" className="btn btn-primary"><Search size={16}/> Explore jobs <ArrowRight size={16}/></Link>}/>
    {error && <ErrorState message={error} onRetry={load}/>}
    {loading ? <Loading label="Syncing your job search…"/> : <>
      <div className="stats-grid">
        <StatCard label="Jobs available" value={jobs.length} detail="Listings returned by your API" icon={BriefcaseBusiness}/>
        <StatCard label="Tracked applications" value={apps.length} detail="Saved in your application tracker" icon={Target} tone="blue"/>
        <StatCard label="Active applications" value={applied} detail="Excludes saved-only entries" icon={Clock3} tone="orange"/>
        <StatCard label="Interviews & offers" value={interviews} detail="Based on your current statuses" icon={CheckCircle2} tone="green"/>
      </div>
      <div className="dashboard-grid">
        <Panel title="Latest opportunities" subtitle="Fresh listings from your connected job source" action={<Link className="text-link" to="/jobs">View all <ArrowRight size={14}/></Link>}>
          {recentJobs.length ? <div className="job-list compact">{recentJobs.map((job, i) => <div className="job-row" key={job.id || job.slug || `${pick(job,["title","role"],"Job")}-${i}`}><div className="company-logo">{String(pick(job,["company_name","company","employer"],"J")).slice(0,1).toUpperCase()}</div><div className="job-row-main"><strong>{pick(job,["title","role","position"],"Untitled role")}</strong><span>{pick(job,["company_name","company","employer"],"Company not listed")} · {pick(job,["location"],"Location not listed")}</span></div><Badge kind="purple">{pick(job,["job_type","jobType","employment_type"],"Role")}</Badge></div>)}</div> : <EmptyState title="No job listings yet" message="Use Find jobs to load current listings from your backend." action={<Link className="btn btn-secondary btn-sm" to="/jobs">Find jobs</Link>}/>}
        </Panel>
        <Panel title="Application pulse" subtitle="Your tracked progress">
          <div className="pulse-total"><span>Applications tracked</span><strong>{apps.length}</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{width: `${apps.length ? Math.min(100, applied / apps.length * 100) : 0}%`}}/></div>
          <div className="pulse-legend"><span><i className="legend-dot purple-dot"/> Active / applied</span><strong>{applied}</strong></div>
          <div className="pulse-legend"><span><i className="legend-dot green-dot"/> Interviews / offers</span><strong>{interviews}</strong></div>
          <Link to="/applications" className="btn btn-secondary full-btn">Open tracker <ArrowRight size={15}/></Link>
        </Panel>
      </div>
      <section className="workflow-banner"><div className="workflow-orb"><Sparkles size={25}/></div><div className="workflow-copy"><span className="eyebrow">YOUR WORKFLOW</span><h3>From discovery to application.</h3><p>Upload your resume, explore roles, then track each application in one place.</p></div><div className="workflow-steps"><Link to="/resume"><span>01</span><FileText size={17}/> Resume</Link><Link to="/jobs"><span>02</span><Search size={17}/> Discover</Link><Link to="/applications"><span>03</span><TrendingUp size={17}/> Track</Link></div></section>
    </>}
  </>;
}