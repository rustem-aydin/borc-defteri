import { i18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

interface HistoryLog {
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

function groupLogs(logs: HistoryLog[]): {
  sections: GroupedLog[];
  weeklyCount: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

  let weeklyCount = 0;
  const groupedMap = new Map<string, HistoryLog[]>();

  logs.forEach((log) => {
    const d = new Date(log.tarih);
    const logDate = new Date(d);
    logDate.setHours(0, 0, 0, 0);

    if (logDate < oneWeekAgo) return;
    if (log.islem < 0) weeklyCount += Math.abs(log.islem);

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

  return { sections, weeklyCount };
}

// Query options — hem hook hem prefetch için ortak
export const historyQueryOptions = (
  db: ReturnType<typeof useSQLiteContext>,
) => ({
  queryKey: ["history", "last7days"] as const,
  queryFn: async () => {
    const logs = await db.getAllAsync<HistoryLog>(
      `SELECT * FROM history_logs 
       WHERE tarih >= datetime('now', '-7 days') 
       ORDER BY tarih DESC`,
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
