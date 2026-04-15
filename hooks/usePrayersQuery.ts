import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

interface PrayerParams {
  vakit_id: string;
  kalan_sayi: number;
}

export function usePrayersQuery() {
  const db = useSQLiteContext();

  return useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const result = await db.getAllAsync<PrayerParams>(
        "SELECT * FROM prayers",
      );
      const totalDebt = result.reduce((acc, curr) => acc + curr.kalan_sayi, 0);
      return { prayers: result, totalDebt };
    },
  });
}

export function usePushUpdate() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  return async (vakit_id: string, currentAmount: number, change: number) => {
    const newAmount = Math.max(0, currentAmount + change);
    if (newAmount === currentAmount) return;
    const tarih = new Date().toISOString();
    await db.runAsync(
      "INSERT INTO history_logs (tarih, islem, vakit_id) VALUES (?, ?, ?)",
      [tarih, change, vakit_id],
    );
    await db.runAsync("UPDATE prayers SET kalan_sayi = ? WHERE vakit_id = ?", [
      newAmount,
      vakit_id,
    ]);
    queryClient.invalidateQueries({ queryKey: ["prayers"] });
    queryClient.invalidateQueries({ queryKey: ["weeklyHistory"] });
    queryClient.invalidateQueries({ queryKey: ["lastPrayer"] }); // ← eklendi
  };
}
