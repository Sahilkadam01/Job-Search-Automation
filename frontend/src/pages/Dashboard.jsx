import { useEffect, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Target,
  TrendingUp,
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
// import RecentJobs from "../components/dashboard/RecentJobs";
import { fetchJobs } from "../services/api";

const initialStats = [
  {
    title: "Jobs discovered",
    value: "—",
    description: "Jobs returned by your backend",
    icon: BriefcaseBusiness,
    accent: "violet",
  },
  {
    title: "Matched to you",
    value: "—",
    description: "Matched jobs, when available",
    icon: Target,
    accent: "blue",
  },
  {
    title: "Applications sent",
    value: "—",
    description: "Application tracking to be connected",
    icon: TrendingUp,
    accent: "emerald",
  },
  {
    title: "Profile strength",
    value: "—",
    description: "Available after profile integration",
    icon: Activity,
    accent: "amber",
  },
];

function normalizeJobs(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.jobs)) {
    return response.jobs;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

export default function Dashboard({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchJobs();

        if (!cancelled) {
          setJobs(normalizeJobs(response));
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Unable to load jobs from the backend.";

          setError(String(message));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = initialStats.map((stat, index) => {
    if (index === 0) {
      return {
        ...stat,
        value: loading ? "…" : error ? "—" : String(jobs.length),
      };
    }

    return stat;
  });

  return (
    <div className="space-y-7">
      <WelcomeBanner
        onExploreJobs={() => onNavigate("Find Jobs")}
      />

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your job search at a glance
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            An overview of your current job-search data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* <RecentJobs
        jobs={jobs}
        loading={loading}
        error={error}
        onViewAll={() => onNavigate("Find Jobs")}
        onViewJob={(job) => {
          if (job.url || job.job_url || job.apply_url) {
            const url = job.url || job.job_url || job.apply_url;

            try {
              const parsed = new URL(url);

              if (["https:", "http:"].includes(parsed.protocol)) {
                window.open(parsed.href, "_blank", "noopener,noreferrer");
              }
            } catch {
              console.error("The job URL is invalid.");
            }
          } else {
            window.alert("No external job link is available for this listing.");
          }
        }}
      /> */}

      <p className="pb-2 text-center text-xs text-slate-400">
        Job statistics are shown only when supported by available backend data.
      </p>
    </div>
  );
}