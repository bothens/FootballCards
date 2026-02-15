import React, { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "dark" | "light";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "ft_theme";

const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset both theme flags to avoid mixed light/dark UI.
    root.classList.remove("dark", "theme-light");

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "#000000";
      body.style.color = "#ffffff";
    } else {
      root.classList.add("theme-light");
      root.style.colorScheme = "light";
      body.style.backgroundColor = "#f7f7f8";
      body.style.color = "#0a0a0a";
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export { ThemeContext };
