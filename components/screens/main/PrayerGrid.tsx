import { usePrayersQuery, usePushUpdate } from "@/hooks/usePrayersQuery";
import { i18n } from "@/lib/i18n";
import { StyleSheet, View } from "react-native";
import { PrayerCard } from "./PrayerCard";

export function PrayerGrid() {
  // ekle

  const VAKITLER: Record<string, { title: string; color: string; image: any }> =
    {
      sabah: {
        title: i18n.t("diger.vakitler.sabah"),
        color: "#ecd4d3",
        image: require("@/assets/times/sabah.png"),
      },
      ogle: {
        title: i18n.t("diger.vakitler.ogle"),
        color: "#fce474",
        image: require("@/assets/times/ogle.png"),
      },
      ikindi: {
        title: i18n.t("diger.vakitler.ikindi"),
        color: "#febe9b",
        image: require("@/assets/times/ikindi.png"),
      },
      aksam: {
        title: i18n.t("diger.vakitler.aksam"),
        color: "#db6165",
        image: require("@/assets/times/aksam.png"),
      },
      yatsi: {
        title: i18n.t("diger.vakitler.yatsi"),
        color: "#161a64",
        image: require("@/assets/times/yatsi.png"),
      },
      vitir: {
        title: i18n.t("diger.vakitler.vitir"),
        color: "#1d467f",
        image: require("@/assets/times/vitr.png"),
      },
    };

  const { data } = usePrayersQuery();
  const pushUpdate = usePushUpdate();
  const prayers = data?.prayers ?? [];

  return (
    <View style={styles.grid}>
      {prayers.map((prayer) => {
        const info = VAKITLER[prayer.vakit_id] ?? {
          title: prayer.vakit_id,
          color: "#004d4c",
          image: require("@/assets/times/sabah.png"),
        };
        return (
          <PrayerCard
            key={prayer.vakit_id}
            vakit_id={prayer.vakit_id}
            kalan_sayi={prayer.kalan_sayi}
            title={info.title}
            color={info.color}
            image={info.image}
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
