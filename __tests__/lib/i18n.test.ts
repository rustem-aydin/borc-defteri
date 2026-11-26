import en from "@/lib/i18n/locales/en-US/translation.json";
import tr from "@/lib/i18n/locales/tr-TR/translation.json";

const locales = { en, tr } as const;
type LocaleCode = keyof typeof locales;

// Fıkhi hüküm taşıyan bölümler: Hanefi/Şafii metinleri burada ayrışmalı.
const FIQH_SECTIONS = [
  "nedir",
  "tertip",
  "hangi_namazlar",
  "kerahat",
  "faq",
] as const;

/**
 * Sözlükteki tüm yaprak anahtar yollarını (dizi indeksleri dahil) döndürür.
 * Dizi elemanları da gezilir; böylece bir dilde eksik dizi elemanı yakalanır.
 */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      keyPaths(item, prefix ? `${prefix}.${index}` : `${index}`),
    );
  }
  if (typeof value === "object" && value !== null) {
    // Dizi değil, nesne: Object.entries için indekslenebilir görünüm.
    const record = value as Record<string, unknown>;
    return Object.entries(record).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("i18n sözlükleri", () => {
  it.each(Object.keys(locales) as LocaleCode[])(
    "%s: info.hanefi ve info.safii aynı anahtar kümesine sahip",
    (lang) => {
      const hanefi = keyPaths(locales[lang].info.hanefi).sort();
      const safii = keyPaths(locales[lang].info.safii).sort();

      expect(hanefi).toEqual(safii);
    },
  );

  it.each(Object.keys(locales) as LocaleCode[])(
    "%s: fıkhi bölümlerde Hanefi ve Şafii metinleri farklı",
    (lang) => {
      const { hanefi, safii } = locales[lang].info;

      for (const section of FIQH_SECTIONS) {
        expect({
          section,
          differs:
            JSON.stringify(hanefi[section]) !== JSON.stringify(safii[section]),
        }).toEqual({ section, differs: true });
      }
    },
  );

  it("en-US sözlüğü tr-TR ile aynı anahtar kümesine sahip", () => {
    const trKeys = keyPaths(tr).sort();
    const enKeys = keyPaths(en).sort();

    expect(enKeys).toEqual(trKeys);
  });

  it("ergenlik ipucu mezhebe göre ayrışır ve iki dilde de bulunur", () => {
    for (const lang of Object.keys(locales) as LocaleCode[]) {
      const hint = locales[lang].autoForm.pubertyHint;

      expect(typeof hint.hanefi).toBe("string");
      expect(typeof hint.safii).toBe("string");
      expect(hint.hanefi.length).toBeGreaterThan(0);
      expect(hint.safii.length).toBeGreaterThan(0);
      expect(hint.hanefi).not.toBe(hint.safii);
      expect(hint.hanefi).toContain(lang === "tr" ? "Hanefi" : "Hanafi");
    }
  });
});
