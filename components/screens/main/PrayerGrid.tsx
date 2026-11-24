import { getPrayerMetadata, PrayerKey } from "@/lib/prayers";
import { usePrayersQuery, usePushUpdate } from "@/hooks/usePrayersQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { useMadhab } from "@/hooks/useMadhab";
import { VITR_ENABLED_KEY } from "../settings/VitrSection";
import { PrayerCard } from "./PrayerCard";

export function PrayerGrid() {
  const { madhab } = useMadhab();
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

  const { data } = usePrayersQuery();
  const pushUpdate = usePushUpdate();
  const prayers = data?.prayers ?? [];

  // Vitir yalnızca Hanefi'de borçtur; ayar kapalıysa da gizlenir.
  const showVitir = vitrEnabled && madhab === "hanefi";
  const visiblePrayers = showVitir
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
            onDecrement={() => {
              void pushUpdate(prayer.vakit_id, -1);
            }}
            onIncrement={() => {
              void pushUpdate(prayer.vakit_id, +1);
            }}
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
