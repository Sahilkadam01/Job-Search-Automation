import { useRef, useState } from "react";
import { ArrowDownToLine, CheckCircle2, FileText, FileUp, LoaderCircle, RefreshCw, Sparkles, UploadCloud } from "lucide-react";
import { api, getErrorMessage } from "../api.js";
import { PageHeading, Panel, Toast } from "../components/UI.jsx";

function downloadBlob(data, filename) {
  const url = URL.createObjectURL(data); const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
export default function Resume() {
  const inputRef = useRef(null); const [file,setFile] = useState(null); const [profile,setProfile] = useState(null); const [uploadResult,setUploadResult] = useState(null);
  const [busy,setBusy] = useState(""); const [error,setError] = useState(""); const [toast,setToast] = useState(null);
  function chooseFile(f) { if (!f) return; if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {setError("Please select a PDF file.");return;} setError("");setFile(f); }
  async function upload() {
    if (!file) {setError("Choose a PDF resume first.");return;}
    const form = new FormData(); form.append("file",file);
    setBusy("upload");setError("");setUploadResult(null);
    try {
      const r = await api.post("/resume/upload",form,{headers:{"Content-Type":"multipart/form-data"}});
      setUploadResult(r.data); const candidate = r.data?.profile || r.data?.candidate_profile || r.data?.analysis || r.data?.data?.profile;
      if (candidate) setProfile(candidate);
      setToast({type:"success",message:"Resume uploaded and the backend responded."});
    } catch(e) {
      setError(getErrorMessage(e));
      if (/429|quota|resource_exhausted|limit/i.test(JSON.stringify(e?.response?.data||e?.message||""))) setToast({type:"error",message:"Gemini quota may be exhausted. The upload request reached an AI-dependent step; try again after quota resets."});
    } finally {setBusy("");}
  }
  async function runAction(kind) {
    setBusy(kind);setError("");
    try {
      if(kind==="customize") {
        const r=await api.post("/resume/customize",{resume_text:uploadResult?.text || uploadResult?.resume_text || "", profile, job_description:""});
        setProfile(r.data?.profile || r.data?.resume || r.data);setToast({type:"success",message:"Resume customization completed."});
      } else {
        const r=await api.post("/resume/generate",{profile});
        if(r.data instanceof Blob) downloadBlob(r.data,"tailored-resume.docx");
        else if(r.data?.download_url) window.open(r.data.download_url,"_blank","noopener,noreferrer");
        else if(r.data?.content) downloadBlob(new Blob([r.data.content]),"tailored-resume.docx");
        else setToast({type:"success",message:"Resume generation endpoint responded. Check the response details below."});
        setUploadResult(prev=>({...prev,generation_response:r.data}));
      }
    } catch(e){setError(getErrorMessage(e));} finally{setBusy("");}
  }
  const profileEntries = profile && typeof profile==="object" ? Object.entries(profile) : [];
  return <>
    <PageHeading eyebrow="YOUR CAREER FOUNDATION" title={<>Resume <span className="gradient-text">studio.</span></>} description="Upload your PDF, review the profile extracted by your backend, and use your resume endpoints when AI quota is available."/>
    <div className="resume-layout">
      <div className="resume-main-column">
        <Panel title="Upload your resume" subtitle="PDF only · Your file is sent to your local FastAPI backend">
          <div className={`upload-dropzone ${file?"has-file":""}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();chooseFile(e.dataTransfer.files?.[0]);}} onClick={()=>inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" hidden onChange={e=>chooseFile(e.target.files?.[0])}/>
            <div className="upload-icon"><UploadCloud size={26}/></div><strong>{file ? file.name : "Drop your resume here"}</strong><span>{file ? `${(file.size/1024/1024).toFixed(2)} MB · Ready to upload` : "or click to browse your files"}</span><small>PDF format · Recommended under 10 MB</small>
          </div>
          <div className="upload-actions"><button className="btn btn-primary" disabled={!file||!!busy} onClick={e=>{e.stopPropagation();upload();}}>{busy==="upload"?<><LoaderCircle size={16} className="spin"/> Uploading…</>:<><FileUp size={16}/> Upload & analyze</>}</button><button className="btn btn-secondary" disabled={!file||!!busy} onClick={()=>{setFile(null);setError("");}}>Clear file</button></div>
          {error && <div className="inline-error">{error}</div>}
          <div className="note-box"><Sparkles size={17}/><span>AI-dependent analysis can fail while Gemini's free-tier quota is exhausted. This screen will show the backend's actual response rather than pretend analysis succeeded.</span></div>
        </Panel>
        <Panel title="Candidate profile" subtitle="The profile returned by your resume analysis endpoint" action={profile && <button className="btn btn-secondary btn-sm" onClick={()=>downloadBlob(new Blob([JSON.stringify(profile,null,2)],{type:"application/json"}),"candidate-profile.json")}><ArrowDownToLine size={14}/> Export JSON</button>}>
          {profileEntries.length ? <div className="profile-fields">{profileEntries.map(([key,val])=><div className="profile-field" key={key}><span>{key.replace(/_/g," ")}</span><strong>{Array.isArray(val)?val.join(", "):typeof val==="object"?JSON.stringify(val):String(val ?? "—")}</strong></div>)}</div> : <div className="profile-empty"><FileText size={25}/><strong>Your profile will appear here</strong><span>Upload a resume after your API and AI quota are ready.</span></div>}
          {uploadResult && <details className="response-details"><summary>View raw API response</summary><pre>{JSON.stringify(uploadResult,null,2)}</pre></details>}
        </Panel>
      </div>
      <div className="resume-side-column">
        <Panel title="Resume tools" subtitle="Uses your existing backend endpoints">
          <div className="tool-item"><div className="tool-item-icon"><Sparkles size={18}/></div><div><strong>Customize resume</strong><p>Tailor your resume content for a specific job. Add job description support to the form once the endpoint schema is confirmed.</p></div><button className="icon-button" disabled={!profile||!!busy} onClick={()=>runAction("customize")} title="Customize resume"><RefreshCw size={16}/></button></div>
          <div className="tool-item"><div className="tool-item-icon blue"><FileText size={18}/></div><div><strong>Generate document</strong><p>Request a downloadable resume from your backend generator.</p></div><button className="icon-button" disabled={!profile||!!busy} onClick={()=>runAction("generate")} title="Generate resume">{busy==="generate"?<LoaderCircle className="spin" size={16}/>:<ArrowDownToLine size={16}/>}</button></div>
        </Panel>
        <Panel title="Pipeline status" subtitle="What is ready to use">
          <div className="pipeline-line"><span className="pipeline-check"><CheckCircle2 size={16}/></span><div><strong>PDF upload UI</strong><small>Ready</small></div><span className="pipeline-badge">Ready</span></div>
          <div className="pipeline-line"><span className="pipeline-check"><CheckCircle2 size={16}/></span><div><strong>FastAPI integration</strong><small>Uses /resume/upload</small></div><span className="pipeline-badge">Connected</span></div>
          <div className="pipeline-line"><span className="pipeline-wait">3</span><div><strong>AI profile analysis</strong><small>Requires available Gemini quota</small></div><span className="pipeline-badge waiting">AI</span></div>
        </Panel>
      </div>
    </div>
    <Toast toast={toast} onClose={()=>setToast(null)}/>
  </>;
}