import { getLocales } from "expo-localization";
import * as Updates from "expo-updates";
import { I18n } from "i18n-js";
import en from "./locales/en-US/translation.json";
import tr from "./locales/tr-TR/translation.json";

// Cihaz dilini al ve kontrol et (sadece tr veya en, yoksa default en)
const rawLanguage = getLocales()?.[0]?.languageCode ?? "en";
export const deviceLanguage = rawLanguage === "tr" ? "tr" : "en";

export const i18n = new I18n({
  en,
  tr,
});

i18n.defaultLocale = "en";
i18n.enableFallback = true;
i18n.locale = deviceLanguage;

export function changeLanguage(lang: string) {
  // Sadece tr veya en kabul et
  const validLang = lang === "tr" ? "tr" : "en";
  i18n.locale = validLang;
  Updates.reloadAsync();
  console.log(validLang);
}
