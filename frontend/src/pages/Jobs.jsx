import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, ExternalLink, MapPin, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { api, getErrorMessage, unwrap } from "../api.js";
import { Badge, EmptyState, ErrorState, Loading, PageHeading, Toast, pick } from "../components/UI.jsx";

export default function Jobs() {
  const [jobs, setJobs] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [query, setQuery] = useState(""); const [location, setLocation] = useState(""); const [type, setType] = useState("all"); const [toast, setToast] = useState(null);
  async function load() {
    setLoading(true); setError("");
    try { const r = await api.get("/jobs"); const d = unwrap(r.data); setJobs(Array.isArray(d) ? d : Array.isArray(d?.jobs) ? d.jobs : []); }
    catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => jobs.filter(j => {
    const text = [j.title,j.role,j.position,j.company,j.company_name,j.description,j.tags?.join?.(" ")].filter(Boolean).join(" ").toLowerCase();
    const loc = String(j.location || "").toLowerCase();
    const jobType = String(j.job_type || j.jobType || j.employment_type || "").toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!location || loc.includes(location.toLowerCase())) && (type === "all" || jobType.includes(type));
  }), [jobs, query, location, type]);
  async function saveJob(job) {
    try {
      await api.post("/jobs/auto-save", { job });
      setToast({type:"success",message:"Job sent to auto-save endpoint."});
    } catch (e) { setToast({type:"error",message:getErrorMessage(e)}); }
  }
  return <>
    <PageHeading eyebrow="DISCOVER YOUR NEXT ROLE" title={<>Find work that <span className="gradient-text">fits you.</span></>} description="Search real listings from your connected job source. Filter by keywords, location, and employment type." action={<button className="btn btn-secondary" onClick={load}><RefreshCw size={15}/> Refresh jobs</button>}/>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Role, company, or keyword…"/></div><div className="search-field location-field"><MapPin size={17}/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location"/></div><div className="select-field"><SlidersHorizontal size={16}/><select value={type} onChange={e=>setType(e.target.value)}><option value="all">All types</option><option value="full">Full-time</option><option value="part">Part-time</option><option value="contract">Contract</option><option value="remote">Remote</option></select></div></div>
    <div className="results-caption"><span>{loading ? "Fetching listings…" : `${filtered.length} opportunities`}</span><span>Connected source: Arbeitnow API</span></div>
    {loading ? <Loading label="Loading job listings…"/> : error ? <ErrorState message={error} onRetry={load}/> : filtered.length ? <div className="jobs-grid">{filtered.map((job,i) => {
      const title=pick(job,["title","role","position"],"Untitled role"); const company=pick(job,["company_name","company","employer"],"Company not listed"); const href=pick(job,["url","job_url","apply_url","application_url"],"");
      const tags=Array.isArray(job.tags)?job.tags:[];
      return <article className="job-card" key={job.id || job.slug || `${title}-${i}`}><div className="job-card-top"><div className="company-logo large">{String(company).slice(0,1).toUpperCase()}</div><Badge kind="purple">{pick(job,["job_type","jobType","employment_type"],"Opportunity")}</Badge></div><h3>{title}</h3><div className="company-name">{company}</div><div className="job-meta"><span><MapPin size={14}/>{pick(job,["location"],"Location not listed")}</span><span><BriefcaseBusiness size={14}/>{pick(job,["remote"],"Open role") === true ? "Remote" : pick(job,["remote"],"") || "Job listing"}</span></div>{tags.length>0&&<div className="tag-list">{tags.slice(0,4).map(t=><span className="tag" key={t}>{t}</span>)}</div>}<p className="job-description">{String(pick(job,["description","summary"],"Open this listing to review the full role description.")).replace(/<[^>]*>/g," ").replace(/\s+/g," ").slice(0,180)}{String(job.description||"").length>180?"…":""}</p><div className="job-card-actions"><button className="btn btn-secondary btn-sm" onClick={()=>saveJob(job)}>Save job</button>{href && href!=="—" ? <a className="btn btn-primary btn-sm" href={href} target="_blank" rel="noreferrer">View role <ArrowUpRight size={15}/></a> : <button className="btn btn-primary btn-sm" onClick={()=>setToast({type:"error",message:"This listing does not include an external URL."})}>View role <ArrowUpRight size={15}/></button>}</div></article>;
    })}</div> : <EmptyState icon={BriefcaseBusiness} title={jobs.length ? "No matching roles" : "No listings returned"} message={jobs.length ? "Try a broader keyword or clear your filters." : "Your backend returned no jobs. Check the /jobs endpoint or try refreshing."} action={jobs.length>0 && <button className="btn btn-secondary btn-sm" onClick={()=>{setQuery("");setLocation("");setType("all");}}>Clear filters</button>}/>}
    <Toast toast={toast} onClose={()=>setToast(null)}/>
  </>;
}