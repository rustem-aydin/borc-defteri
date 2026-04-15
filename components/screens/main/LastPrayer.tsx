import { useLastPrayerQuery } from "@/hooks/useLastPrayerQuery";
import { i18n } from "@/lib/i18n";
import { StyleSheet, Text, View } from "react-native";

export default function LastPrayer() {
  const { data: lastLog = "—" } = useLastPrayerQuery({
    dun: i18n.t("diger.dun"),
    kilindi: i18n.t("diger.kilindi"),
    eklendi: i18n.t("diger.eklendi"),
    sonIslem: i18n.t("diger.sonIslem"),
  });

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{i18n.t("diger.kazaListesi")}</Text>
      <Text style={styles.sectionSubtitle}>{lastLog}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6f7978",
    letterSpacing: 1,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6f7978",
    fontStyle: "italic",
    opacity: 0.8,
  },
});
