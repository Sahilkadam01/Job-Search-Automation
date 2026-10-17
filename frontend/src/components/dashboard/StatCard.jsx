
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "violet",
}) {
  const accents = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  const iconStyle = accents[accent] || accents.violet;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value ?? 0}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {Icon ? <Icon size={21} /> : <ArrowUpRight size={21} />}
        </div>
      </div>

      {description && (
        <div className="mt-4 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
          <ArrowDownRight size={14} className="mt-0.5 shrink-0" />
          <span>{description}</span>
        </div>
      )}
    </article>
  );
}
