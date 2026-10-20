
import { AlertCircle, RefreshCw, X } from "lucide-react";

export default function ErrorMessage({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again.",
  onRetry,
  onDismiss,
  variant = "error",
}) {
  const styles = {
    error: {
      wrapper: "border-rose-200 bg-rose-50",
      icon: "bg-rose-100 text-rose-600",
      heading: "text-rose-900",
      text: "text-rose-700",
    },
    warning: {
      wrapper: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      heading: "text-amber-900",
      text: "text-amber-700",
    },
    info: {
      wrapper: "border-blue-200 bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      heading: "text-blue-900",
      text: "text-blue-700",
    },
  };

  const style = styles[variant] || styles.error;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border p-4 ${style.wrapper}`}
    >
      <div className={`shrink-0 rounded-xl p-2 ${style.icon}`}>
        <AlertCircle size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className={`text-sm font-bold ${style.heading}`}>
          {title}
        </h3>

        <p className={`mt-1 text-sm leading-6 ${style.text}`}>
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${style.text} transition hover:underline`}
          >
            <RefreshCw size={15} />
            Try again
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className={`rounded-lg p-1 transition hover:bg-white/60 ${style.text}`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
