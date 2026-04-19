import { Header } from "@/components/Header";
import { AppearanceSection } from "@/components/screens/settings/AppearanceSection";
import { CalculationSection } from "@/components/screens/settings/CalculationSection";
import { HeroSection } from "@/components/screens/settings/HeroSection";
import { NotificationsSection } from "@/components/screens/settings/NotificationsSection";
import { SecuritySection } from "@/components/screens/settings/SecuritySection";
import { TargetSection } from "@/components/screens/settings/Targets";
import { VitrSection } from "@/components/screens/settings/VitrSection";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={i18n.t("headers.ayarlar")} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <View style={styles.sections}>
          <VitrSection />
          <TargetSection />
          {/* <LanguageSection /> */}
          <AppearanceSection />
          <SecuritySection />
          <NotificationsSection />
          <CalculationSection />
        </View>
      </ScrollView>
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safe: {
    flex: 1,
    backgroundColor: C.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 10,
  },
  sections: {
    gap: 32,
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
