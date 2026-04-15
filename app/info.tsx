import React, { useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { FaqSection } from "@/components/screens/info/Faqsection";
import { HangiNamazlarCard } from "@/components/screens/info/Hanginamazlarcard";
import { HeroSection } from "@/components/screens/info/Herosection";
import { KazaNedirCard } from "@/components/screens/info/Kazanedircard";
import { MekruhVakitlerCard } from "@/components/screens/info/Mekruhvakitlercard";
import { NasilKilinirCard } from "@/components/screens/info/Nasilkilinircard";
import TabBarInfo from "@/components/screens/info/TabBar";
import { TertipSahibiCard } from "@/components/screens/info/Tertipsahibicard";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { TabInfo } from "../constants/colors";

export default function KazaNamazlariScreen() {
  const styles = useStyles();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabInfo>("hanefi");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={styles.safeArea.backgroundColor}
      />

      <Header title={i18n.t("headers.bilgi")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <TabBarInfo active={activeTab} onChange={setActiveTab} />

        <View style={styles.formArea}>
          <KazaNedirCard mezhep={activeTab} />
          <HangiNamazlarCard mezhep={activeTab} />
          <NasilKilinirCard mezhep={activeTab} />
          <TertipSahibiCard mezhep={activeTab} />
          <MekruhVakitlerCard mezhep={activeTab} />
          <FaqSection mezhep={activeTab} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Verilen bilgiler Diyanet İşleri Başkanlığı ve muteber fıkıh
            kaynakları esas alınarak hazırlanmıştır. Özel durumlar için bir
            fıkıh alimine danışılması tavsiye edilir.
          </Text>
          <Text style={styles.footerIcon}>🌿</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safeArea: {
    flex: 1,
    backgroundColor: C.surface,
  },
  formArea: {
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
}));
