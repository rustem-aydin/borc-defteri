import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, View } from "react-native";

export function HeroSection() {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {i18n.t(`editSection.editPrefix`)}
        <Text style={styles.accent}>{i18n.t(`editSection.editHighlight`)}</Text>
      </Text>
      <Text style={styles.subtitle}>{i18n.t(`editSection.subtitle`)}</Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    marginBottom: 48,
  },
  heading: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 36,
    letterSpacing: -0.8,
    color: C.onSurface,
    marginBottom: 8,
    lineHeight: 44,
  },
  accent: {
    color: C.primary,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 15,
    color: C.onSurfaceVariant,
    lineHeight: 24,
    maxWidth: 340,
  },
}));
