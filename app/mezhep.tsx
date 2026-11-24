import { Header } from "@/components/Header";
import { Madhab } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { useMadhab } from "@/hooks/useMadhab";
import { i18n } from "@/lib/i18n";
import { MADHABS, saveMadhab } from "@/lib/madhab";
import { useTheme } from "@/lib/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MadhabScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { colors } = useTheme();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const isOnboarding = from === "onboarding";
  const { madhab, ready } = useMadhab();
  const [selected, setSelected] = useState<Madhab | null>(null);
  const [saving, setSaving] = useState(false);
  const activeMadhab = selected ?? (isOnboarding ? null : madhab);
  const canContinue = selected !== null || (!isOnboarding && ready);

  async function handleContinue() {
    if (!activeMadhab || !canContinue || saving) return;
    setSaving(true);
    await saveMadhab(activeMadhab);

    if (isOnboarding) {
      // Mezhep seçildi; şimdi hesaplama (vitir bu mezhebe göre hesaplanır).
      router.replace("/calculate?from=onboarding");
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={i18n.t("madhab.title")} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {isOnboarding && (
          <Text style={styles.step}>{i18n.t("madhab.onboardingStep")}</Text>
        )}
        <Text style={styles.heading}>{i18n.t("madhab.chooseTitle")}</Text>
        <Text style={styles.subheading}>
          {i18n.t("madhab.chooseSubtitle")}
        </Text>

        <View style={styles.options}>
          {MADHABS.map((option) => {
            const active = activeMadhab === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={i18n.t(`madhab.${option}`)}
                onPress={() => setSelected(option)}
                style={({ pressed }) => [
                  styles.option,
                  active && styles.optionActive,
                  pressed && !active && styles.optionPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    active && styles.optionIconActive,
                  ]}
                >
                  <MaterialIcons
                    name="menu-book"
                    size={24}
                    color={active ? colors.onPrimary : colors.primary}
                  />
                </View>

                <View style={styles.optionTextWrap}>
                  <Text
                    style={[
                      styles.optionTitle,
                      active && styles.optionTitleActive,
                    ]}
                  >
                    {i18n.t(`madhab.${option}`)}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {i18n.t(`madhab.${option}Description`)}
                  </Text>
                </View>

                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canContinue || saving}
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            (!canContinue || saving) && styles.primaryButtonDisabled,
            pressed && canContinue && !saving && styles.primaryButtonPressed,
          ]}
        >
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                {i18n.t(isOnboarding ? "madhab.continue" : "madhab.save")}
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={colors.onPrimary}
              />
            </>
          )}
        </Pressable>
      </ScrollView>

      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safe: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: C.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  step: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: C.primary,
    marginBottom: 12,
  },
  heading: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: C.onSurface,
  },
  subheading: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: C.onSurfaceVariant,
  },
  options: {
    marginTop: 28,
    gap: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: C.surfaceContainerLowest,
    shadowColor: C.onSurface,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  optionActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryFixed,
  },
  optionPressed: {
    backgroundColor: C.surfaceContainerLow,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.secondaryContainer,
  },
  optionIconActive: {
    backgroundColor: C.primary,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.onSurface,
  },
  optionTitleActive: {
    color: C.primary,
  },
  optionDescription: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: C.onSurfaceVariant,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: C.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
  },
  primaryButton: {
    marginTop: 32,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.primary,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonPressed: {
    backgroundColor: C.primaryContainer,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onPrimary,
  },
  blobTopRight: {
    position: "absolute",
    top: 40,
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
