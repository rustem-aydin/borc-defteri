import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export interface PrayerRow {
  vakit_id: string;
  kalan_sayi: number;
}

export interface PrayersData {
  prayers: PrayerRow[];
  totalDebt: number;
}

export const PRAYERS_KEY = ["prayers"] as const;

export function usePrayersQuery() {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: PRAYERS_KEY,
    queryFn: async (): Promise<PrayersData> => {
      const result = await db.getAllAsync<PrayerRow>(
        "SELECT vakit_id, kalan_sayi FROM prayers",
      );
      return {
        prayers: result,
        totalDebt: result.reduce((acc, curr) => acc + curr.kalan_sayi, 0),
      };
    },
  });
}

export function usePushUpdate() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return useCallback(
    async (vakit_id: string, change: number) => {
      // İyimser güncelleme: sayaç, DB turunu beklemeden anında değişir.
      const previous = queryClient.getQueryData<PrayersData>(PRAYERS_KEY);
      const current =
        previous?.prayers.find((prayer) => prayer.vakit_id === vakit_id)
          ?.kalan_sayi ?? 0;

      if (Math.max(0, current + change) === current) return;

      if (previous) {
        const prayers = previous.prayers.map((prayer) =>
          prayer.vakit_id === vakit_id
            ? {
                ...prayer,
                kalan_sayi: Math.max(0, prayer.kalan_sayi + change),
              }
            : prayer,
        );
        queryClient.setQueryData<PrayersData>(PRAYERS_KEY, {
          prayers,
          totalDebt: prayers.reduce((acc, prayer) => acc + prayer.kalan_sayi, 0),
        });
      }

      const tarih = new Date().toISOString();

      try {
        await db.withTransactionAsync(async () => {
          await db.runAsync(
            "INSERT INTO history_logs (tarih, islem, vakit_id) VALUES (?, ?, ?)",
            [tarih, change, vakit_id],
          );
          // Artırma/azaltma SQL'de yapılır: hızlı çift dokunuşta kayıp güncelleme olmaz.
          await db.runAsync(
            "UPDATE prayers SET kalan_sayi = MAX(0, kalan_sayi + ?) WHERE vakit_id = ?",
            [change, vakit_id],
          );
        });
      } catch (error) {
        // DB yazımı başarısızsa iyimser değeri gerçek veriyle düzelt.
        queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: PRAYERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["weeklyHistory"] });
      queryClient.invalidateQueries({ queryKey: ["lastPrayer"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    [db, queryClient],
  );
}
