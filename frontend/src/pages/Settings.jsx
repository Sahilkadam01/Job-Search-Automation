
import { useState } from "react";
import {
  Settings as SettingsIcon,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  SlidersHorizontal,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  targetRole: "Frontend Developer",
  locations: "Gurugram, Delhi, Remote",
  workMode: "Any",
  jobType: "Full-time",
  minimumMatch: 70,
  autoSearch: true,
  searchInterval: "6",
  emailNotifications: true,
};

function SettingSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("ai-job-hunter-settings");
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedMessage, setSavedMessage] = useState("");

  function updateSetting(name, value) {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
    setSavedMessage("");
  }

  function handleSave(event) {
    event.preventDefault();

    try {
      localStorage.setItem(
        "ai-job-hunter-settings",
        JSON.stringify(settings)
      );
      setSavedMessage("Your settings have been saved on this device.");
    } catch {
      setSavedMessage("Unable to save settings in this browser.");
    }
  }

  function handleReset() {
    setSettings({ ...DEFAULT_SETTINGS });
    setSavedMessage("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
          <SettingsIcon size={16} />
          <span>Preferences</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Customize your job search preferences and automation options.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Job preferences */}
        <SettingSection
          icon={BriefcaseBusiness}
          title="Job Preferences"
          description="Tell AI Job Hunter which opportunities you want to find."
        >
          <Field label="Target job role">
            <input
              className={inputClass}
              value={settings.targetRole}
              onChange={(event) =>
                updateSetting("targetRole", event.target.value)
              }
              placeholder="e.g. Python Developer"
              required
            />
          </Field>

          <Field
            label="Preferred locations"
            hint="Separate multiple locations with commas. Include Remote if applicable."
          >
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${inputClass} pl-11`}
                value={settings.locations}
                onChange={(event) =>
                  updateSetting("locations", event.target.value)
                }
                placeholder="Delhi, Gurugram, Remote"
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Work mode">
              <select
                className={inputClass}
                value={settings.workMode}
                onChange={(event) =>
                  updateSetting("workMode", event.target.value)
                }
              >
                <option value="Any">Any work mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </Field>

            <Field label="Employment type">
              <select
                className={inputClass}
                value={settings.jobType}
                onChange={(event) =>
                  updateSetting("jobType", event.target.value)
                }
              >
                <option value="Any">Any employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </Field>
          </div>
        </SettingSection>

        {/* Matching preferences */}
        <SettingSection
          icon={SlidersHorizontal}
          title="AI Matching"
          description="Set how closely a job should match your profile."
        >
          <Field
            label={`Minimum resume match: ${settings.minimumMatch}%`}
            hint="This preference is stored locally. Your backend must use this value before it affects actual job filtering."
          >
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.minimumMatch}
              onChange={(event) =>
                updateSetting("minimumMatch", Number(event.target.value))
              }
              className="w-full accent-violet-600"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>More results</span>
              <span>Closer matches</span>
            </div>
          </Field>
        </SettingSection>

        {/* Automation */}
        <SettingSection
          icon={Clock3}
          title="Automation"
          description="Configure your preferred job-search schedule."
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Automatic job search
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Enable your preferred automatic-search setting.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.autoSearch}
              onClick={() =>
                updateSetting("autoSearch", !settings.autoSearch)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                settings.autoSearch ? "bg-violet-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                  settings.autoSearch ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <Field
            label="Search interval"
            hint="Changing this option does not reconfigure the backend scheduler yet."
          >
            <select
              className={inputClass}
              value={settings.searchInterval}
              onChange={(event) =>
                updateSetting("searchInterval", event.target.value)
              }
              disabled={!settings.autoSearch}
            >
              <option value="1">Every hour</option>
              <option value="3">Every 3 hours</option>
              <option value="6">Every 6 hours</option>
              <option value="12">Every 12 hours</option>
              <option value="24">Every 24 hours</option>
            </select>
          </Field>
        </SettingSection>

        {/* Notifications */}
        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Choose whether you want job-search notification preferences enabled."
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(event) =>
                updateSetting("emailNotifications", event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded accent-violet-600"
            />

            <span>
              <span className="block text-sm font-medium text-slate-800">
                Email notifications
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Save my preference for job and application updates. Actual
                emails require notification-service integration.
              </span>
            </span>
          </label>
        </SettingSection>

        {/* Save actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            {savedMessage && (
              <>
                <CheckCircle2 size={17} />
                <span>{savedMessage}</span>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
