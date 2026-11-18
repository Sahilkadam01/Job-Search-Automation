
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";

import {
  loginUser,
  registerUser,
} from "../../services/api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = isLogin
        ? await loginUser({
            email: form.email.trim(),
            password: form.password,
          })
        : await registerUser({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          });

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      onAuthSuccess(response.user);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#172033]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT SECTION */}
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#172b4d] px-10 py-9 text-white lg:flex xl:px-16 xl:py-12">

          <div className="absolute -right-32 top-24 h-96 w-96 rounded-full border border-white/[0.08]" />
          <div className="absolute -right-16 top-40 h-64 w-64 rounded-full border border-white/[0.08]" />
          <div className="absolute bottom-20 left-[-100px] h-80 w-80 rounded-full border border-white/[0.07]" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#172b4d]">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Career<span className="text-[#a8c7ff]">Path</span>
              </h1>
              <p className="text-[10px] tracking-[2px] text-white/50">
                FIND YOUR NEXT OPPORTUNITY
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 my-16 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Your next opportunity starts here
            </div>

            <h2 className="text-4xl font-semibold leading-[1.2] tracking-tight xl:text-6xl">
              Build a career
              <br />
              that moves
              <br />
              <span className="text-[#a8c7ff]">
                you forward.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-white/65">
              Discover opportunities that match your skills,
              explore new career paths, and keep your job
              search organised in one place.
            </p>

            {/* Feature list */}
            <div className="mt-11 space-y-5">
              {[
                "Find opportunities that match your profile",
                "Keep track of your job applications",
                "Manage your resume and career progress",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/85"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#a8c7ff]"
                  />
                  {item}
                </div>
              ))}
            </div>

            {/* Small job card */}
            <div className="mt-12 max-w-md rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50">
                    YOUR CAREER DASHBOARD
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Everything in one place.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { value: "Jobs", label: "Explore" },
                  { value: "Resume", label: "Manage" },
                  { value: "Track", label: "Progress" },
                ].map((item) => (
                  <div
                    key={item.value}
                    className="rounded-xl bg-white/[0.07] p-3"
                  >
                    <p className="text-sm font-semibold">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/40">
            <p>© {new Date().getFullYear()} CareerPath</p>
            <p>Make your next move count.</p>
          </div>
        </section>

        {/* RIGHT SECTION */}
        <section className="flex min-h-screen flex-col bg-white">

          {/* Mobile brand */}
          <div className="flex items-center justify-between px-6 py-6 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172b4d] text-white">
                <BriefcaseBusiness size={21} />
              </div>

              <span className="text-lg font-bold tracking-tight">
                Career<span className="text-[#4169a8]">Path</span>
              </span>
            </div>

            <span className="text-xs text-gray-400">
              Career starts here
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
            <div className="w-full max-w-[430px]">

              {/* Heading */}
              <div className="mb-9">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3fc] text-[#315b96]">
                  {isLogin ? (
                    <BriefcaseBusiness size={23} />
                  ) : (
                    <Users size={23} />
                  )}
                </div>

                <p className="mb-2 text-sm font-medium text-[#5275a6]">
                  {isLogin
                    ? "WELCOME BACK"
                    : "START YOUR JOURNEY"}
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-[36px]">
                  {isLogin
                    ? "Sign in to your account"
                    : "Create your account"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {isLogin
                    ? "Pick up where you left off. Your next opportunity could be waiting."
                    : "Create an account to discover jobs and organise your applications."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#344054]">
                      Full name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#4169a8] focus:ring-4 focus:ring-[#4169a8]/10"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#344054]">
                    Email address
                  </label>

                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#4169a8] focus:ring-4 focus:ring-[#4169a8]/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-[#344054]">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete={
                        isLogin
                          ? "current-password"
                          : "new-password"
                      }
                      className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#4169a8] focus:ring-4 focus:ring-[#4169a8]/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {!isLogin && (
                    <p className="mt-2 text-xs text-gray-400">
                      Use at least 8 characters.
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#244875] px-5 text-sm font-semibold text-white transition hover:bg-[#19385f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isLogin
                    ? "Sign in"
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <div className="mt-7 text-center text-sm text-gray-500">
                {isLogin
                  ? "New to CareerPath?"
                  : "Already have an account?"}

                <button
                  type="button"
                  onClick={() => {
                    setMode(isLogin ? "register" : "login");
                    setError("");
                  }}
                  className="ml-1.5 font-semibold text-[#315b96] hover:text-[#172b4d]"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </div>

              {/* Trust note */}
              <div className="mt-10 flex items-center justify-center gap-2 border-t border-gray-100 pt-6 text-xs text-gray-400">
                <ShieldCheck size={16} />
                Your account information is securely protected.
              </div>
            </div>
          </div>

          {/* Mobile footer */}
          <div className="px-6 pb-6 text-center text-xs text-gray-400 lg:hidden">
            © {new Date().getFullYear()} CareerPath. All rights reserved.
          </div>
        </section>
      </div>
    </main>
  );
}
