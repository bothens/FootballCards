import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useI18n } from "../hooks/useI18n";

export const Settings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useI18n();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const isDark = theme === "dark";
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-2xl font-black">{t("settings")}</h1>
          <p className="text-zinc-400 text-sm mt-1">{t("settingsSubtitle")}</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                {t("darkMode")}
              </div>
              <div className="text-sm text-zinc-300 mt-1">
                {isDark ? t("darkModeHint") : t("lightModeEnabled")}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors ${
                isDark
                  ? "bg-emerald-500/80 border-emerald-500/60"
                  : "bg-zinc-700/60 border-zinc-600"
              }`}
              aria-pressed={isDark}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-black shadow transition-transform ${
                  isDark ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-400">
                {t("language")}
              </div>
              <div className="text-sm text-zinc-300 mt-1">
                {t("chooseLanguage")}
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "sv" | "en")}
              className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="sv">Svenska</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
