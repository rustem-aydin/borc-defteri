import { getPrayerMetadata, PrayerKey } from "@/lib/prayers";
import { usePrayersQuery, usePushUpdate } from "@/hooks/usePrayersQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { VITR_ENABLED_KEY } from "../settings/VitrSection";
import { PrayerCard } from "./PrayerCard";

export function PrayerGrid() {
  const [vitrEnabled, setVitrEnabled] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(VITR_ENABLED_KEY);
      setVitrEnabled(stored === null ? true : stored === "true");
    }

    load();

    const subscription = DeviceEventEmitter.addListener("VitrUpdated", load);
    return () => subscription.remove();
  }, []);

  const { data, refetch } = usePrayersQuery();
  const pushUpdate = usePushUpdate();
  const prayers = data?.prayers ?? [];

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "PrayersUpdated",
      () => {
        refetch();
      },
    );
    return () => subscription.remove();
  }, [refetch]);

  const visiblePrayers = vitrEnabled
    ? prayers
    : prayers.filter((prayer) => prayer.vakit_id !== "vitir");

  return (
    <View style={styles.grid}>
      {visiblePrayers.map((prayer) => {
        const meta = getPrayerMetadata(prayer.vakit_id as PrayerKey);
        return (
          <PrayerCard
            key={prayer.vakit_id}
            vakit_id={prayer.vakit_id}
            kalan_sayi={prayer.kalan_sayi}
            title={meta.label}
            color={meta.color}
            image={meta.image}
            onDecrement={() =>
              pushUpdate(prayer.vakit_id, prayer.kalan_sayi, -1)
            }
            onIncrement={() =>
              pushUpdate(prayer.vakit_id, prayer.kalan_sayi, +1)
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
