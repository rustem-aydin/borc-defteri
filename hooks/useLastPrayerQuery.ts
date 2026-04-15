import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

interface HistoryLog {
  id: number;
  tarih: string;
  islem: number;
  vakit_id: string;
}

interface LastPrayerLabels {
  dun: string;
  kilindi: string;
  eklendi: string;
  sonIslem: string;
}

export function useLastPrayerQuery(labels: LastPrayerLabels) {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: ["lastPrayer"],
    queryFn: async () => {
      const last = await db.getFirstAsync<HistoryLog>(
        "SELECT * FROM history_logs ORDER BY tarih DESC LIMIT 1",
      );
      if (!last) return "—";

      const d = new Date(last.tarih);
      const now = new Date();

      const toMidnight = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

      const todayTime = toMidnight(now);
      const yesterdayTime = toMidnight(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
      );
      const targetTime = toMidnight(d);

      const saat = d.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      let tarihMetni: string;
      if (targetTime === todayTime) {
        tarihMetni = saat;
      } else if (targetTime === yesterdayTime) {
        tarihMetni = `${labels.dun}, ${saat}`;
      } else {
        tarihMetni = `${d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}, ${saat}`;
      }

      const eylem = last.islem < 0 ? labels.kilindi : labels.eklendi;
      return `${labels.sonIslem}: ${tarihMetni} ${last.vakit_id} ${eylem}`;
    },
  });
}
