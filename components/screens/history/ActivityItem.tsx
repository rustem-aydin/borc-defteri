import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

const VAKIT_IMAGES: Record<string, any> = {
  sabah: require("@/assets/times/sabah.png"),
  ogle: require("@/assets/times/ogle.png"),
  ikindi: require("@/assets/times/ikindi.png"),
  aksam: require("@/assets/times/aksam.png"),
  yatsi: require("@/assets/times/yatsi.png"),
  vitir: require("@/assets/times/vitr.png"),
};

export interface HistoryLog {
  id: number;
  tarih: string;
  islem: number;
  vakit_id: string;
}

export function ActivityItem({ item }: { item: HistoryLog }) {
  const styles = useStyles();
  const { isDark } = useTheme();

  const isKildim = item.islem < 0;

  const VAKIT_LABELS: Record<string, string> = {
    sabah: i18n.t("diger.vakitler.sabah"),
    ogle: i18n.t("diger.vakitler.ogle"),
    ikindi: i18n.t("diger.vakitler.ikindi"),
    aksam: i18n.t("diger.vakitler.aksam"),
    yatsi: i18n.t("diger.vakitler.yatsi"),
    vitir: i18n.t("diger.vakitler.vitir"),
  };
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const successColor = isDark ? "#4ade80" : "#166534";
  const errorColor = isDark ? "#fb923c" : "#9a3412";
  const successBg = isDark ? "#052e16" : "#F0FDF4";
  const errorBg = isDark ? "#2c1503" : "#FFF7ED";

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isKildim ? successBg : errorBg },
          ]}
        >
          <Image source={VAKIT_IMAGES[item.vakit_id]} style={styles.image} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.vakitText}>{VAKIT_LABELS[item.vakit_id]}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.timeText}>{formatTime(item.tarih)}</Text>
            <View style={styles.dot} />
            <Text
              style={[
                styles.actionText,
                { color: isKildim ? successColor : errorColor },
              ]}
            >
              {isKildim
                ? i18n.t("diger.kazaKilindi")
                : i18n.t("diger.borcEklendi")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSide}>
        <View style={styles.badge}>
          <Text
            style={[
              styles.countText,
              { color: isKildim ? successColor : errorColor },
            ]}
          >
            {isKildim ? "-" : "+"}
            {Math.abs(item.islem)}
          </Text>
          <MaterialIcons
            name={isKildim ? "keyboard-arrow-down" : "keyboard-arrow-up"}
            size={16}
            color={isKildim ? successColor : errorColor}
          />
        </View>
      </View>
    </View>
  );
}

// ... styles aynı kalır
const useStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    backgroundColor: C.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceContainerHigh,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 46,
    height: 46,
    backgroundColor: C.surfaceContainerLowest,

    resizeMode: "contain",
  },
  infoContainer: {
    marginLeft: 12,
  },
  vakitText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.outlineVariant,
    marginHorizontal: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  rightSide: {
    alignItems: "flex-end",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  countText: {
    fontSize: 15,
    fontWeight: "800",
    marginRight: 2,
  },
}));
