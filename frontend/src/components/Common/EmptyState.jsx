
import {
  BriefcaseBusiness,
  Search,
  Bookmark,
  FileText,
  Inbox,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const iconMap = {
  jobs: BriefcaseBusiness,
  search: Search,
  saved: Bookmark,
  resume: FileText,
  applications: Inbox,
  ai: Sparkles,
};

export default function EmptyState({
  type = "default",
  title = "Nothing here yet",
  description = "Your content will appear here when it becomes available.",
  actionLabel = "",
  onAction,
  secondaryActionLabel = "",
  onSecondaryAction,
  icon: CustomIcon,
}) {
  const Icon = CustomIcon || iconMap[type] || Inbox;

  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center sm:px-10">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 via-indigo-50 to-blue-100 text-violet-600">
        <div className="absolute inset-0 rounded-3xl bg-violet-200/20 blur-xl" />
        <Icon size={34} strokeWidth={1.7} className="relative" />
      </div>

      <h3 className="text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            {actionLabel}
            <ArrowRight size={16} />
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            <RotateCcw size={15} />
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </section>
  );
}
