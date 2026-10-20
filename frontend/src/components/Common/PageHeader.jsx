
import { Sparkles } from "lucide-react";

export default function PageHeader({
  eyebrow = "",
  title,
  description = "",
  action = null,
  icon: Icon = Sparkles,
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            <Sparkles size={13} />
            {eyebrow}
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 sm:flex">
            <Icon size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
