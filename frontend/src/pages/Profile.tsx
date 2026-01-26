import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/ui/types";

export const Profile: React.FC = () => {
  const { isAuthenticated, user, updateProfile, changePassword, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsername(user?.username ?? "");
  }, [user?.username]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<User> = {};
    const dn = username.trim();
    if (dn && dn !== (user?.username ?? "")) payload.username = dn;

    const cp = currentPassword.trim();
    const np = newPassword.trim();
    const wantsPasswordChange = cp.length > 0 || np.length > 0;
    if (wantsPasswordChange && (!cp || !np)) {
      alert("Fyll i bÃ¥de currentPassword och newPassword");
      return;
    }

    if (!payload.username && !wantsPasswordChange) {
      alert("Inget att uppdatera");
      return;
    }

    setLoading(true);
    try {
      if (payload.username) {
        await updateProfile({ username: payload.username });
      }
      if (wantsPasswordChange && cp && np) {
        await changePassword(cp, np);
      }
      setCurrentPassword("");
      setNewPassword("");
      alert("Profil uppdaterad");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Kunde inte uppdatera profilen";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">Profile</h1>
              <p className="text-zinc-400 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-xs font-black uppercase"
              type="button"
              disabled={loading}
            >
              Logout
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                Display Name
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                placeholder="Display name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-4 rounded-xl uppercase tracking-widest transition-all"
            >
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
