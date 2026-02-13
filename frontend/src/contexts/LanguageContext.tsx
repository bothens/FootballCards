import React, { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type LanguageCode = "sv" | "en";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (next: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ft_language";

const getInitialLanguage = (): LanguageCode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "sv";
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (next: LanguageCode) => {
    setLanguageState(next);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export { LanguageContext };
