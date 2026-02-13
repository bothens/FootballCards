import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";

export const Home: React.FC = () => {
  const { isAuthenticated, login, register } = useAuth();
  const { t } = useI18n();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/market" replace />;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const nameToUse = displayName.trim() || email.split("@")[0];
        await register(email, password, nameToUse);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("authFailed");
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: "user" | "admin") => {
    setMode("login");
    if (role === "user") {
      setEmail("user@user.com");
      setPassword("Password123!");
    } else {
      setEmail("admin@admin.com");
      setPassword("Password123!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="text-black font-black text-4xl italic">F</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            {t("appName")}
          </h1>
          <p className="text-zinc-400 text-sm">
            {t("tagline")}
          </p>
          <p className="text-zinc-500 text-xs mt-3 uppercase tracking-widest font-bold">
            {t("newUserGuide")}
          </p>
        </div>

        <div className="bg-zinc-900/90 p-8 rounded-2xl border border-zinc-800 shadow-2xl mb-6">
          <div className="flex mb-8 bg-black p-1 rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "login"
                  ? "bg-emerald-500 text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
              type="button"
            >
              {t("login").toUpperCase()}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "register"
                  ? "bg-emerald-500 text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
              type="button"
            >
              {t("register").toUpperCase()}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                  {t("displayName")}
                </label>
                <input
                  type="text"
                  placeholder={t("displayNamePlaceholder")}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("emailAddress")}
              </label>
              <input
                type="email"
                placeholder="trader@elite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-4 z-10 h-8 w-8 flex items-center justify-center text-zinc-500 hover:text-emerald-400 transition-colors"
                  aria-label="Hold to reveal password"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.938 7.152a1 1 0 0 1 0 .696C20.577 16.49 16.64 19.5 12 19.5s-8.577-3.01-9.938-7.152" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] active:scale-95"
            >
              {loading
                ? t("processing")
                : mode === "login"
                ? t("enterPlatform")
                : t("createAccount")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-[10px] text-center text-zinc-500 uppercase font-black tracking-widest mb-4">
              {t("quickAccess").toUpperCase()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleQuickLogin("user")}
                disabled={loading}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black py-3 rounded-lg uppercase tracking-tighter transition-colors border border-zinc-700 disabled:opacity-50"
                type="button"
              >
                {t("loginAsUser").toUpperCase()}
              </button>
              <button
                onClick={() => handleQuickLogin("admin")}
                disabled={loading}
                className="flex-1 bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-400 text-white text-[10px] font-black py-3 rounded-lg uppercase tracking-tighter transition-colors border border-zinc-700 hover:border-emerald-500/50 disabled:opacity-50"
                type="button"
              >
                {t("loginAsAdmin").toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 uppercase tracking-widest font-bold">
          {t("secureAccess")}
        </p>
      </div>
    </div>
  );
};
