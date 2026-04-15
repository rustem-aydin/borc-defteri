import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export function HeroSection() {
  const styles = useStyles();

  return (
    <View style={styles.heroSection}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>📖 {i18n.t("info.hero.etiket")}</Text>
      </View>
      <Text style={styles.heroTitle}>{i18n.t("info.hero.baslik")}</Text>
      <Text style={styles.heroSubtitle}>{i18n.t("info.hero.altbaslik")}</Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  heroSection: {
    marginBottom: 28,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.secondaryContainer,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.onSecondaryContainer,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "500",
    color: C.onSurfaceVariant,
    lineHeight: 22,
  },
}));
