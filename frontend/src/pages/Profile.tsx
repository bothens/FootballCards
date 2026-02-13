import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/ui/types";
import { useI18n } from "../hooks/useI18n";

export const Profile: React.FC = () => {
  const { isAuthenticated, user, updateProfile, changePassword, logout } = useAuth();
  const { t } = useI18n();

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const avatarOptions = [
    "ace", "nova", "atlas", "kira", "jax", "sage", "piper", "milo"
  ].map((seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);

  useEffect(() => {
    setUsername(user?.username ?? "");
    setAvatarUrl(user?.avatar ?? "");
  }, [user?.username, user?.avatar]);

  

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<User> = {};
    const dn = username.trim();
    if (dn && dn !== (user?.username ?? "")) payload.username = dn;

    const avatar = avatarUrl.trim();
    if (avatar && avatar !== (user?.avatar ?? "")) payload.avatar = avatar;

    const cp = currentPassword.trim();
    const np = newPassword.trim();
    const wantsPasswordChange = cp.length > 0 || np.length > 0;
    if (wantsPasswordChange && (!cp || !np)) {
      alert(t("fillBothPasswords"));
      return;
    }

    if (!payload.username && !payload.avatar && !wantsPasswordChange) {
      alert(t("nothingToUpdate"));
      return;
    }

    setLoading(true);
    try {
      if (payload.username || payload.avatar) {
        await updateProfile(payload);
      }
      if (wantsPasswordChange && cp && np) {
        await changePassword(cp, np);
      }
      setCurrentPassword("");
      setNewPassword("");
      alert(t("profileUpdated"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("updateError");
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const joinedLabel = user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "-";
  const activeAvatar = avatarUrl || user?.avatar;
  const isBusy = loading || avatarSaving;

  const saveAvatar = async (nextAvatar: string) => {
    setAvatarUrl(nextAvatar);
    setShowAvatarPicker(false);
    if (!nextAvatar || nextAvatar === (user?.avatar ?? "")) return;

    setAvatarSaving(true);
    try {
      await updateProfile({ avatar: nextAvatar });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("updateAvatarError");
      alert(message);
    } finally {
      setAvatarSaving(false);
    }
  };


  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={activeAvatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full border border-zinc-700"
              />
              <div>
                <h1 className="text-2xl font-black">{t("profileTitle")}</h1>
                <p className="text-zinc-400 text-sm">{user?.email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-black">
                  <span className="px-2 py-1 rounded-lg border border-zinc-800 bg-black/40 text-zinc-400">{t("roleLabel")}: {user?.role}</span>
                  <span className="px-2 py-1 rounded-lg border border-zinc-800 bg-black/40 text-zinc-400">{t("joinedLabel")}: {joinedLabel}</span>
                  <span className="px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">{t("balanceLabel")}: EUR {user?.balance?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-xs font-black uppercase"
              type="button"
              disabled={isBusy}
            >
              {t("logout")}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("profileDetails")}</h2>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("displayName")}
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="Display name"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("chooseAvatar")}
              </label>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                className="w-full rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 flex items-center justify-between text-sm text-zinc-300 hover:border-zinc-700 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <img src={activeAvatar} alt="Selected avatar" className="h-9 w-9 rounded-full border border-zinc-700" />
                  <span className="text-xs uppercase tracking-widest font-black text-zinc-400">{t("chooseAvatar")}</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-300">{t("open")}</span>
              </button>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("emailReadOnly")}
              </label>
              <input
                value={user?.email ?? ""}
                readOnly
                className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("security")}</h2>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("currentPassword")}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="********"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("newPassword")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="********"
              />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-black/40 px-4 py-3 text-xs text-zinc-400">
              {t("passwordTip")}
            </div>

            <button
              disabled={isBusy}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-all"
            >
              {loading ? t("saving") : t("updateProfile")}
            </button>
          </div>
        </form>


        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-[280px] rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-black">{t("selectAvatar")}</h3>
                  <p className="text-[10px] text-zinc-500">{t("pickAvatar")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-white"
                >
                  {t("close")}
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-2 py-2">
                <div className="flex items-center gap-3">
                  <img
                    src={activeAvatar}
                    alt="Selected avatar"
                    className="h-7 w-7 rounded-full border border-zinc-700"
                  />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest font-black text-zinc-400">{t("current")}</div>
                    <div className="text-[10px] text-zinc-300">{t("tapToApply")}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
                    void saveAvatar(next);
                  }}
                  className="rounded-lg bg-zinc-800 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-200 hover:bg-zinc-700 transition-colors"
                  disabled={avatarSaving}
                >
                  {t("randomize")}
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {avatarOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      void saveAvatar(option);
                    }}
                    className={`rounded-lg border p-1 transition-colors ${
                      avatarUrl === option
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                    }`}
                    aria-label="Select avatar"
                    disabled={avatarSaving}
                  >
                    <img src={option} alt="Avatar option" className="h-6 w-6 rounded-full mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
