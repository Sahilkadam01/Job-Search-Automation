
import { LoaderCircle, Sparkles } from "lucide-react";

export default function LoadingSpinner({
  message = "Loading...",
  size = "md",
  variant = "default",
  fullScreen = false,
}) {
  const sizes = {
    sm: 18,
    md: 28,
    lg: 40,
  };

  const iconSize = sizes[size] || sizes.md;

  const spinner = (
    <div
      className="flex flex-col items-center justify-center gap-3 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-violet-200/60" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
          {variant === "ai" ? (
            <Sparkles size={iconSize} className="animate-pulse" />
          ) : (
            <LoaderCircle
              size={iconSize}
              className="animate-spin"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">{message}</p>
        {variant === "ai" && (
          <p className="mt-1 text-xs text-slate-500">
            Finding insights for your next opportunity
          </p>
        )}
      </div>

      <span className="sr-only">Please wait</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 p-6 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex min-h-40 items-center justify-center p-6">
      {spinner}
    </div>
  );
}
