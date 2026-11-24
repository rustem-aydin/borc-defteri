import { i18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

export interface HistoryLog {
  id: number;
  tarih: string;
  islem: number;
  vakit_id: string;
}

export interface GroupedLog {
  title: string;
  subtitle: string;
  data: HistoryLog[];
}

/** Geçmiş listesinde gösterilen gün sayısı (bugün dahil). */
export const HISTORY_DAYS = 7;

// i18n'den alınan sabit diziler - doğru key path'leri
const MONTHS = [
  i18n.t("home.months.0"),
  i18n.t("home.months.1"),
  i18n.t("home.months.2"),
  i18n.t("home.months.3"),
  i18n.t("home.months.4"),
  i18n.t("home.months.5"),
  i18n.t("home.months.6"),
  i18n.t("home.months.7"),
  i18n.t("home.months.8"),
  i18n.t("home.months.9"),
  i18n.t("home.months.10"),
  i18n.t("home.months.11"),
];

const DAYS = [
  i18n.t("days.0"),
  i18n.t("days.1"),
  i18n.t("days.2"),
  i18n.t("days.3"),
  i18n.t("days.4"),
  i18n.t("days.5"),
  i18n.t("days.6"),
];

/** Listede gösterilen ilk günün yerel gece yarısı. */
export function getHistoryCutoff(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (HISTORY_DAYS - 1));
  return cutoff;
}

function groupLogs(logs: HistoryLog[], now = new Date()): GroupedLog[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const cutoff = getHistoryCutoff(now);

  const groupedMap = new Map<string, HistoryLog[]>();

  logs.forEach((log) => {
    const logDate = new Date(log.tarih);
    logDate.setHours(0, 0, 0, 0);

    if (logDate < cutoff) return;

    let groupKey: string;
    if (logDate.getTime() === today.getTime()) groupKey = "today";
    else if (logDate.getTime() === yesterday.getTime()) groupKey = "yesterday";
    else groupKey = logDate.toISOString();

    if (!groupedMap.has(groupKey)) groupedMap.set(groupKey, []);
    groupedMap.get(groupKey)!.push(log);
  });

  const sections: GroupedLog[] = [];
  groupedMap.forEach((data, key) => {
    if (key === "today") {
      sections.push({
        title: `${today.getDate()} ${MONTHS[today.getMonth()]} ${DAYS[today.getDay()]}`,
        subtitle: i18n.t("today"),
        data,
      });
    } else if (key === "yesterday") {
      sections.push({
        title: `${yesterday.getDate()} ${MONTHS[yesterday.getMonth()]} ${DAYS[yesterday.getDay()]}`,
        subtitle: i18n.t("yesterday"),
        data,
      });
    } else {
      const d = new Date(key);
      sections.push({
        title: `${d.getDate()} ${MONTHS[d.getMonth()]} ${DAYS[d.getDay()]}`,
        subtitle: "",
        data,
      });
    }
  });

  return sections;
}

// Query options — hem hook hem prefetch için ortak
export const historyQueryOptions = (db: SQLiteDatabase) => ({
  queryKey: ["history", "last7days"] as const,
  queryFn: async () => {
    // Yalnızca listede gösterilen günler ve gösterilen kolonlar okunur.
    const logs = await db.getAllAsync<HistoryLog>(
      `SELECT id, tarih, islem, vakit_id FROM history_logs
       WHERE tarih >= ?
       ORDER BY tarih DESC`,
      [getHistoryCutoff().toISOString()],
    );
    return groupLogs(logs);
  },
  staleTime: 1000 * 60,
  gcTime: 1000 * 60 * 5,
});

export function useHistoryQuery() {
  const db = useSQLiteContext();
  return useQuery(historyQueryOptions(db));
}
