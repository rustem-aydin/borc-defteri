import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { FaqSection } from "@/components/screens/info/Faqsection";
import { HangiNamazlarCard } from "@/components/screens/info/Hanginamazlarcard";
import { HeroSection } from "@/components/screens/info/Herosection";
import { KazaNedirCard } from "@/components/screens/info/Kazanedircard";
import { MekruhVakitlerCard } from "@/components/screens/info/Mekruhvakitlercard";
import { NasilKilinirCard } from "@/components/screens/info/Nasilkilinircard";
import { TertipSahibiCard } from "@/components/screens/info/Tertipsahibicard";
import { makeStyles } from "@/hooks/make-styles";
import { useMadhab } from "@/hooks/useMadhab";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

export default function KazaNamazlariScreen() {
  const styles = useStyles();
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const { madhab, ready } = useMadhab();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Header title={i18n.t("headers.bilgi")} />

      {!ready ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroSection />

          <View style={styles.madhabBar}>
            <View style={styles.madhabInfo}>
              <MaterialIcons
                name="menu-book"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.madhabText}>
                {i18n.t("info.madhabInfo", {
                  madhab: i18n.t(`madhab.${madhab}`),
                })}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/mezhep?from=info")}
              hitSlop={8}
            >
              <Text style={styles.madhabChangeText}>
                {i18n.t("info.changeMadhab")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.formArea}>
            <KazaNedirCard mezhep={madhab} />
            <HangiNamazlarCard mezhep={madhab} />
            <NasilKilinirCard mezhep={madhab} />
            <TertipSahibiCard mezhep={madhab} />
            <MekruhVakitlerCard mezhep={madhab} />
            <FaqSection mezhep={madhab} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{i18n.t("info.footer")}</Text>
            <Text style={styles.footerIcon}>🌿</Text>
          </View>
        </ScrollView>
      )}
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safeArea: {
    flex: 1,
    backgroundColor: C.surface,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  madhabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerLowest,
  },
  madhabInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  madhabText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },
  madhabChangeText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
  },
  formArea: {
    paddingTop: 4,
    paddingBottom: 8,
    gap: 16,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 11,
    color: C.outline,
    textAlign: "center",
    lineHeight: 18,
  },
  footerIcon: {
    fontSize: 28,
    marginTop: 16,
    opacity: 0.2,
  },
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(162,240,238,0.12)",
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(205,232,231,0.12)",
    zIndex: -1,
  },
}));
