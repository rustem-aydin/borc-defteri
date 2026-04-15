import { TabInfoProps } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export function TertipSahibiCard({ mezhep = "hanefi" }: TabInfoProps) {
  const styles = useStyles();
  const prefix = `info.${mezhep}.tertip`;

  return (
    <View style={[styles.card, styles.shadowMd]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircleTertiary}>
          <Text style={styles.iconEmoji}>⏳</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{i18n.t(`info.tertip_title`)}</Text>
        </View>
      </View>

      <Text style={styles.bodyText}>
        Kazaya kalan namazların sırası{" "}
        <Text style={styles.highlightText}>
          {i18n.t(`${prefix}.highlight`)}
        </Text>{" "}
        {i18n.t(`${prefix}.description`)}
      </Text>

      <Text style={[styles.bodyText, styles.bodyTextSpacing]}>
        {i18n.t(`${prefix}.body`)}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceWhite,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  shadowMd: {
    shadowColor: C.onSurface, // Sabit hex kodu tema uyumluluğu için C.onSurface ile değiştirildi
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
  iconCircleTertiary: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.tertiaryFixed,
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
  highlightText: {
    color: C.tertiary,
    fontWeight: "700",
  },
  bodyTextSpacing: {
    marginTop: 8,
  },
}));
