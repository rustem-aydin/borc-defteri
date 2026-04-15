import { i18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

type LangCode = "en" | "tr" | "ar";

// hooks/useLocale.ts
export function useLocale() {
  const [, setVersion] = useState(i18n.version);

  useEffect(() => {
    const unsubscribe = i18n.onChange(() => {
      setVersion(i18n.version);
    });
    return unsubscribe;
  }, []);

  const changeLanguage = (code: LangCode) => {
    i18n.locale = code;
  };

  // ← version'ı dependency olarak kullan, her render'da taze t döner
  const t = (key: string) => i18n.t(key);

  return {
    locale: i18n.locale as LangCode,
    changeLanguage,
    t,
  };
}
