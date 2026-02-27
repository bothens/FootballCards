import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import { Button } from "../components/Common/Button";
import { Input, Label } from "../components/Common/Input";
import { useNotification } from "../contexts/NotificationContext";

const EyeIcon: React.FC = () => (
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
);

export const Home: React.FC = () => {
  const { isAuthenticated, login, register } = useAuth();
  const { t } = useI18n();
  const { showNotification } = useNotification();

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
        showNotification(t("registrationSuccess"), 'success');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("authFailed");
      showNotification(message, 'error');
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
  
  const passwordIcon = (
    <button
      type="button"
      onMouseDown={() => setShowPassword(true)}
      onMouseUp={() => setShowPassword(false)}
      onMouseLeave={() => setShowPassword(false)}
      onTouchStart={() => setShowPassword(true)}
      onTouchEnd={() => setShowPassword(false)}
      className="text-zinc-400 hover:text-primary transition-colors"
      aria-label="Hold to reveal password"
    >
      <EyeIcon />
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-black bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000')] bg-cover bg-center">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-ui-lg mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <span className="text-text-inverted font-black text-4xl italic">F</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            {t("appName")}
          </h1>
          <p className="text-text-muted text-sm">
            {t("tagline")}
          </p>
          <p className="text-zinc-400 text-xs mt-3 uppercase tracking-widest font-bold">
            {t("newUserGuide")}
          </p>
        </div>

        <div className="bg-black/85 p-8 rounded-ui-lg border border-zinc-800 shadow-2xl mb-6">
          <div className="flex mb-8 bg-black/70 p-1 rounded-ui-md border border-zinc-800">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-ui-sm text-xs font-bold transition-all ${
                mode === "login"
                  ? "bg-primary text-text-inverted"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
              type="button"
            >
              {t("login").toUpperCase()}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-ui-sm text-xs font-bold transition-all ${
                mode === "register"
                  ? "bg-primary text-text-inverted"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
              type="button"
            >
              {t("register").toUpperCase()}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <Label htmlFor="displayName">{t("displayName")}</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder={t("displayNamePlaceholder")}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">{t("emailAddress")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@elite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endIcon={passwordIcon}
              />
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading
                ? t("processing")
                : mode === "login"
                ? t("enterPlatform")
                : t("createAccount")}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-label text-center text-zinc-400 uppercase font-black tracking-widest mb-4">
              {t("quickAccess").toUpperCase()}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleQuickLogin("user")}
                disabled={loading}
                variant="secondary"
                fullWidth
                className="tracking-tighter"
              >
                {t("loginAsUser").toUpperCase()}
              </Button>
               <Button
                onClick={() => handleQuickLogin("admin")}
                disabled={loading}
                variant="secondary"
                fullWidth
                className="tracking-tighter hover:border-primary/50 hover:text-primary"
              >
                {t("loginAsAdmin").toUpperCase()}
              </Button>
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
