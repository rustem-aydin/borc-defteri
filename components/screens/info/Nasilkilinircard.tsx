import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export function NasilKilinirCard({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();
  const prefix = `info.${mezhep}.nasil_kilinir`;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircleGray}>
          <Text style={styles.iconEmoji}>🕌</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{i18n.t(`${prefix}.title`)}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>
          {i18n.t(`${prefix}.niyet_title`)}
        </Text>
        <Text style={styles.infoBoxBody}>{i18n.t(`${prefix}.niyet_body`)}</Text>
      </View>

      <View style={[styles.infoBox, styles.infoBoxSpacing]}>
        <Text style={styles.infoBoxTitle}>
          {i18n.t(`${prefix}.uygulama_title`)}
        </Text>
        <Text style={styles.infoBoxBody}>
          {i18n.t(`${prefix}.uygulama_body`)}
        </Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceLow, // Satır içi stilden buraya taşındı
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.primary,
  },
  iconCircleGray: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.surfaceHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 20,
  },
  infoBox: {
    backgroundColor: C.surfaceWhite,
    borderRadius: 16,
    padding: 12,
  },
  infoBoxSpacing: {
    marginTop: 8, // Satır içi stilden buraya taşındı
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  infoBoxBody: {
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
}));
