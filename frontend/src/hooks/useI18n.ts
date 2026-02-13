import { useLanguage } from "./useLanguage";
import { translations } from "../i18n/translations";
import type { TranslationKey } from "../i18n/translations";

type Vars = Record<string, string | number>;

const interpolate = (template: string, vars?: Vars) => {
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, key) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(vars[key]));
  }, template);
};

export const useI18n = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey, vars?: Vars) => {
    const table = translations[language] || translations.sv;
    const fallback = translations.sv[key] || key;
    const value = table[key] || fallback;
    return interpolate(value, vars);
  };

  return { t, language };
};
