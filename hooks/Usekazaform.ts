import { Gender, Tab } from "@/constants/colors";
import { PRAYER_KEYS } from "@/lib/db";
import { i18n } from "@/lib/i18n";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert } from "react-native";

// Adjust this import path to your project's database file
export interface ManualCounts {
  sabah: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
  vitir: string;
}

// ─── Helpers ───────────────────────────────────────────────────────

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/** Parse "DD.MM.YYYY" → Date or null */
export function parseDate(str: string): Date | null {
  const parts = str.split(".");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || y < 1900 || y > 2100) return null;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

function calculate(params: {
  gender: Gender;
  birthDate: Date;
  pubertyAge: number;
  regularPrayerDate: Date;
  monthlyHayzDays: number;
  totalNifasDays: number;
}): Record<string, number> {
  const {
    gender,
    birthDate,
    pubertyAge,
    regularPrayerDate,
    monthlyHayzDays,
    totalNifasDays,
  } = params;

  const pubertyDate = new Date(birthDate);
  pubertyDate.setFullYear(pubertyDate.getFullYear() + pubertyAge);

  if (regularPrayerDate <= pubertyDate) {
    return Object.fromEntries(PRAYER_KEYS.map((k) => [k, 0]));
  }

  let totalDays = daysBetween(pubertyDate, regularPrayerDate);

  if (gender === "kadin") {
    const totalMonths = totalDays / 30;
    const hayzTotal = Math.round(totalMonths * monthlyHayzDays);
    totalDays = Math.max(0, totalDays - hayzTotal - totalNifasDays);
  }

  return Object.fromEntries(PRAYER_KEYS.map((k: any) => [k, totalDays]));
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useKazaForm(onSaved?: () => void) {
  const db = useSQLiteContext();

  const [activeTab, setActiveTab] = useState<Tab>("auto");
  const [loading, setSaving] = useState(false);

  // Auto form state
  const [gender, setGender] = useState<Gender>("erkek");
  const [birthDate, setBirthDate] = useState("");
  const [pubertyAge, setPubertyAge] = useState("12");
  const [regularDate, setRegularDate] = useState("");
  const [monthlyHayz, setMonthlyHayz] = useState("7");
  const [totalNifas, setTotalNifas] = useState("");

  // Manual form state
  const [manual, setManual] = useState<ManualCounts>({
    sabah: "",
    ogle: "",
    ikindi: "",
    aksam: "",
    yatsi: "",
    vitir: "",
  });

  function setManualField(key: keyof ManualCounts, value: string) {
    setManual((prev) => ({ ...prev, [key]: value }));
  }

  async function persistToDb(counts: Record<string, number>) {
    const today = new Date().toISOString().split("T")[0];

    await db.withTransactionAsync(async () => {
      for (const key of PRAYER_KEYS) {
        const val = counts[key] ?? 0;

        // Varsa üzerine yaz (kalan_sayi = excluded.kalan_sayi), yoksa ekle.
        await db.runAsync(
          `INSERT INTO prayers (vakit_id, kalan_sayi) 
         VALUES (?, ?) 
         ON CONFLICT(vakit_id) DO UPDATE SET kalan_sayi = excluded.kalan_sayi`,
          [key, val],
        );

        // Log kaydı: Sadece 0'dan büyük bir değer hesaplanmışsa/girilmişse logla
        if (val > 0) {
          await db.runAsync(
            "INSERT INTO history_logs (tarih, islem, vakit_id) VALUES (?, ?, ?)",
            [today, val, key],
          );
        }
      }
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (activeTab === "auto") {
        const bd = parseDate(birthDate);
        const rd = parseDate(regularDate);

        if (!bd) {
          Alert.alert(
            i18n.t("calculation.error"),
            i18n.t("calculation.invalidBirthDate"),
          );
          return;
        }
        if (!rd) {
          Alert.alert(
            i18n.t("calculation.error"),
            i18n.t("calculation.invalidPrayerDate"),
          );
          return;
        }
        if (rd <= bd) {
          Alert.alert(
            i18n.t("calculation.error"),
            i18n.t("calculation.invalidDateOrder"),
          );
          return;
        }

        const result = calculate({
          gender,
          birthDate: bd,
          pubertyAge: Math.max(1, parseInt(pubertyAge) || 12),
          regularPrayerDate: rd,
          monthlyHayzDays: parseInt(monthlyHayz) || 0,
          totalNifasDays: parseInt(totalNifas) || 0,
        });

        await persistToDb(result);

        const totalDays = result[PRAYER_KEYS[0]] ?? 0;
        Alert.alert(
          i18n.t("calculation.calculationCompleted"),
          i18n.t("calculation.totalDaysSaved", { totalDays }),
          [{ text: i18n.t("calculation.ok"), onPress: onSaved }],
        );
      } else {
        // Manual
        const counts: Record<string, number> = {};
        for (const key of PRAYER_KEYS) {
          const val = parseInt(manual[key as keyof ManualCounts]) || 0;
          if (val < 0) {
            Alert.alert(
              i18n.t("calculation.error"),
              i18n.t("calculation.negativeCountError"),
            );
            return;
          }
          counts[key] = val;
        }

        await persistToDb(counts);
        Alert.alert(
          i18n.t("calculation.saved"),
          i18n.t("calculation.manualSavedSuccess"),
          [{ text: i18n.t("calculation.ok"), onPress: onSaved }],
        );
      }
    } catch (e) {
      Alert.alert(i18n.t("calculation.error"), i18n.t("calculation.saveError"));
    } finally {
      setSaving(false);
    }
  }
  return {
    // Tab
    activeTab,
    setActiveTab,
    // Auto
    gender,
    setGender,
    birthDate,
    setBirthDate,
    pubertyAge,
    setPubertyAge,
    regularDate,
    setRegularDate,
    monthlyHayz,
    setMonthlyHayz,
    totalNifas,
    setTotalNifas,
    // Manual
    manual,
    setManualField,
    // Actions
    handleSave,
    loading,
  };
}
