import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

type PrayerItem = {
  icon: string;
  label: string;
  active: boolean;
};

export function HangiNamazlarCard({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();

  const prefix = `info.${mezhep}`;
  const items = i18n.t(`${prefix}.hangi_namazlar`, {
    returnObjects: true,
  }) as PrayerItem[];

  return (
    <View style={[styles.cardDark, styles.shadowDark]}>
      <Text style={styles.cardDarkTitle}>
        {i18n.t("info.hangi_namazlar_baslik")}
      </Text>

      {items.map((item, i) => (
        <View
          key={i}
          style={[styles.checkRow, !item.active && styles.checkRowDim]}
        >
          <Text
            style={[
              styles.checkIcon,
              item.active ? styles.checkIconActive : styles.checkIconInactive,
            ]}
          >
            {item.icon}
          </Text>
          <Text style={styles.checkLabel}>{item.label}</Text>
        </View>
      ))}

      <View style={styles.decorCircle} />
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  cardDark: {
    backgroundColor: C.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    overflow: "hidden",
  },
  shadowDark: {
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardDarkTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.onPrimary,
    marginBottom: 20,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  checkRowDim: {
    opacity: 0.5,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: "700",
    width: 20,
  },
  checkIconActive: {
    color: C.primaryFixed,
  },
  checkIconInactive: {
    color: C.onPrimary,
  },
  checkLabel: {
    fontSize: 15,
    color: C.onPrimary,
    fontWeight: "500",
    flex: 1,
  },
  decorCircle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.primaryContainer,
    opacity: 0.3,
    right: -40,
    bottom: -40,
  },
}));
