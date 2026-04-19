import { i18n } from "@/lib/i18n";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

const VAKITLER_COLORS: Record<string, string> = {
  sabah: "#ecd4d3",
  ogle: "#fce474",
  ikindi: "#febe9b",
  aksam: "#db6165",
  yatsi: "#161a64",
  vitir: "#1d467f",
};

export function useWeeklyHistoryQuery(startOfWeek: Date, endOfWeek: Date) {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: ["weeklyHistory", startOfWeek.toISOString()],
    queryFn: async () => {
      const result = await db.getAllAsync<{
        tarih: string;
        islem: number;
        vakit_id: string;
      }>(
        "SELECT tarih, islem, vakit_id FROM history_logs WHERE tarih >= ? AND tarih <= ? AND islem < 0 ORDER BY tarih ASC;",
        [startOfWeek.toISOString(), endOfWeek.toISOString()],
      );
      // 'as string[]' ekleyerek TS'i ikna ediyoruz
      // t<DönecekTip>(...) formatı
      // Fonksiyonun yanına <string[]> ekleyin
      const DAY_LABELS = Array.from({ length: 7 }, (_, i) =>
        i18n.t(`diger.gunler.${i}`),
      );
      const weekStats = DAY_LABELS.map((day) => ({
        day,
        val: 0,
        sabah: 0,
        ogle: 0,
        ikindi: 0,
        aksam: 0,
        yatsi: 0,
        vitir: 0,
      }));

      let total = 0;

      result.forEach((log) => {
        let dayIdx = new Date(log.tarih).getDay() - 1;
        if (dayIdx === -1) dayIdx = 6;
        const count = Math.abs(log.islem);
        weekStats[dayIdx].val += count;
        total += count;
        if ((weekStats[dayIdx] as any)[log.vakit_id] !== undefined) {
          (weekStats[dayIdx] as any)[log.vakit_id] += count;
        }
      });

      const chartData = weekStats.map((stat) => {
        const segments = (
          ["sabah", "ogle", "ikindi", "aksam", "yatsi", "vitir"] as const
        )
          .filter((v) => stat[v] > 0)
          .map((v) => ({ vakit: v, c: VAKITLER_COLORS[v], h: stat[v] }));

        return {
          day: stat.day,
          val: stat.val.toString(),
          color: stat.val > 0 ? "#059669" : "#bec9c8",
          segments,
        };
      });

      return { chartData, weeklyTotal: total };
    },
    placeholderData: keepPreviousData, // ← tek ekleme bu
  });
}
