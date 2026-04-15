import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export function KazaNedirCard({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();

  const prefix = `info.${mezhep}.nedir`;

  return (
    <View style={[styles.card, styles.shadowMd]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCirclePrimary}>
          <Text style={styles.iconEmoji}>📚</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{i18n.t(`info.nedir_baslik`)}</Text>
          <Text style={styles.cardSubtitle}>
            {i18n.t(`info.nedir_subtitle`)}
          </Text>
        </View>
      </View>
      <Text style={styles.bodyText}>{i18n.t(`${prefix}.description`)}</Text>
      <Text style={[styles.bodyText, { marginTop: 10 }]}>
        {i18n.t(`${prefix}.second_description`)}
      </Text>
    </View>
  );
}
const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  shadowMd: {
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
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
  cardSubtitle: {
    fontSize: 13,
    color: C.secondary,
    marginTop: 2,
  },
  iconCirclePrimary: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 20,
  },
  bodyText: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    lineHeight: 22,
    fontWeight: "500",
  },
  boldPrimary: {
    color: C.primary,
    fontWeight: "700",
  },
}));
