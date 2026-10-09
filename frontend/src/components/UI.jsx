import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw, SearchX } from "lucide-react";

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}
export function Panel({ title, subtitle, action, children, className = "" }) {
  return <section className={`panel ${className}`}><div className="panel-heading"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>;
}
export function StatCard({ label, value, detail, icon: Icon, tone = "purple" }) {
  return <motion.div className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></motion.div>;
}
export function Loading({ label = "Loading data…" }) {
  return <div className="state-box"><LoaderCircle className="spin" size={24}/><span>{label}</span></div>;
}
export function ErrorState({ message, onRetry }) {
  return <div className="state-box error-state"><AlertCircle size={23}/><strong>Couldn't load this data</strong><span>{message}</span>{onRetry && <button className="btn btn-secondary btn-sm" onClick={onRetry}><RefreshCw size={14}/> Try again</button>}</div>;
}
export function EmptyState({ title = "Nothing here yet", message = "When data is available, it will appear here.", icon: Icon = SearchX, action }) {
  return <div className="state-box empty-state"><div className="empty-icon"><Icon size={22}/></div><strong>{title}</strong><span>{message}</span>{action}</div>;
}
export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.type || "success"}`} role="status">{toast.type === "error" ? <AlertCircle size={17}/> : <CheckCircle2 size={17}/>}<span>{toast.message}</span><button onClick={onClose} aria-label="Dismiss notification">×</button></div>;
}
export function Badge({ children, kind = "neutral" }) { return <span className={`badge badge-${kind}`}>{children}</span>; }
export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
export function pick(obj, keys, fallback = "—") {
  for (const key of keys) if (obj?.[key] !== undefined && obj?.[key] !== null && obj[key] !== "") return obj[key];
  return fallback;
}