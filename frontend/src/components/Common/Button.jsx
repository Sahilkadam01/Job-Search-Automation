
import { LoaderCircle, ArrowRight } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight = false,
  fullWidth = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-200",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    outline:
      "border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const isDisabled = disabled || loading;
  const ActionIcon = Icon || ArrowRight;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200",
        "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "active:scale-[0.98]",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {loading ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : Icon && !iconRight ? (
        <ActionIcon size={17} />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconRight && <ActionIcon size={17} />}
    </button>
  );
}

