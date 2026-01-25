import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "../api/authService";
import {
  apiLogin,
  apiRegister,
  apiUpdateProfile,
  saveToken,
  getToken,
  saveUser,
  getUser,
  clearAuth,
} from "../api/authService";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<UserProfile | null>(() => getUser());

  const isAuthenticated = useMemo(() => !!token, [token]);

  useEffect(() => {
    const syncFromStorage = () => {
      const storedToken = getToken();
      setToken(storedToken);

      const storedUser = getUser();
      setUser(storedUser);
    };

    syncFromStorage();
    window.addEventListener("auth:changed", syncFromStorage);
    return () => {
      window.removeEventListener("auth:changed", syncFromStorage);
    };
  }, []);

  const notifyAuthChanged = () => {
    window.dispatchEvent(new Event("auth:changed"));
  };

  async function login(email: string, password: string) {
    const res = await apiLogin(email, password);

    saveToken(res.token);
    saveUser({
      userId: res.userId,
      email: res.email,
      displayName: res.displayName,
    });

    setToken(res.token);
    setUser({
      userId: res.userId,
      email: res.email,
      displayName: res.displayName,
    });
    notifyAuthChanged();

    return res;
  }

  async function register(email: string, password: string, displayName: string) {
    const res = await apiRegister(email, password, displayName);

    saveToken(res.token);
    saveUser({
      userId: res.userId,
      email: res.email,
      displayName: res.displayName,
    });

    setToken(res.token);
    setUser({
      userId: res.userId,
      email: res.email,
      displayName: res.displayName,
    });
    notifyAuthChanged();

    return res;
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
    notifyAuthChanged();
  }

  async function updateProfile(payload: {
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const res = await apiUpdateProfile(payload);

    const current = getUser();
    if (current) {
      const updated: UserProfile = {
        ...current,
        displayName:
          payload.displayName?.trim() && payload.displayName.trim().length > 0
            ? payload.displayName.trim()
            : current.displayName,
      };

      saveUser(updated);
      setUser(updated);
      notifyAuthChanged();
    }

    return res;
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };
}
