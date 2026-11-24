import Logo from "@/components/Logo";
import { ColorScheme } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { markOnboardingSeen } from "@/lib/onboarding";
import { useTheme } from "@/lib/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SlideId = "welcome" | "calculation" | "tracking" | "privacy";
type Accent = "primary" | "tertiary";

type SlideMeta = {
  id: SlideId;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accent: Accent;
};

const SLIDES: SlideMeta[] = [
  { id: "welcome", icon: "mosque", accent: "primary" },
  {
    id: "calculation",
    icon: "calculator-variant-outline",
    accent: "tertiary",
  },
  { id: "tracking", icon: "calendar-check-outline", accent: "primary" },
  { id: "privacy", icon: "shield-lock-outline", accent: "primary" },
];

const FEATURE_KEYS = ["one", "two", "three"] as const;

function getGradient(accent: Accent, colors: ColorScheme): [string, string] {
  return accent === "tertiary"
    ? [colors.tertiary, colors.tertiaryContainer]
    : [colors.primary, colors.primaryContainer];
}

function OnboardingSlide({
  slide,
  width,
  height,
  compact,
}: {
  slide: SlideMeta;
  width: number;
  height: number;
  compact: boolean;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const accentColor =
    slide.accent === "tertiary" ? colors.tertiary : colors.primary;

  return (
    <View style={[styles.slide, { width }, height > 0 ? { height } : null]}>
      <View style={styles.slideInner}>
        <View
          style={[
            styles.illustration,
            {
              width: compact ? 112 : 148,
              height: compact ? 112 : 148,
            },
          ]}
        >
          <View
            style={[styles.glow, { backgroundColor: accentColor }]}
            pointerEvents="none"
          />
          <LinearGradient
            colors={getGradient(slide.accent, colors)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.iconBox,
              { borderRadius: compact ? 34 : 44 },
            ]}
          >
            <MaterialCommunityIcons
              name={slide.icon}
              size={compact ? 58 : 74}
              color={colors.onPrimary}
            />
          </LinearGradient>
        </View>

        <Text style={[styles.eyebrow, { color: accentColor }]}>
          {i18n.t(`onboarding.slides.${slide.id}.eyebrow`)}
        </Text>
        <Text style={[styles.title, compact && styles.titleCompact]}>
          {i18n.t(`onboarding.slides.${slide.id}.title`)}
        </Text>
        <Text style={styles.description}>
          {i18n.t(`onboarding.slides.${slide.id}.description`)}
        </Text>

        <View style={styles.features}>
          {FEATURE_KEYS.map((key) => (
            <View key={key} style={styles.featureRow}>
              <View style={styles.checkBadge}>
                <MaterialIcons name="check" size={14} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>
                {i18n.t(`onboarding.slides.${slide.id}.features.${key}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const compact = height < 700;

  const listRef = useRef<FlatList<SlideMeta>>(null);
  const finishingRef = useRef(false);
  const previousWidthRef = useRef(width);
  const [index, setIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);

  const isLast = index === SLIDES.length - 1;

  useEffect(() => {
    if (previousWidthRef.current === width) return;
    previousWidthRef.current = width;
    listRef.current?.scrollToOffset({
      offset: index * width,
      animated: false,
    });
  }, [index, width]);

  const finish = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    await markOnboardingSeen();
    // Mezhep, hesaplamadan önce seçilir: vitir borcu mezhebe göre değişir.
    router.replace("/mezhep?from=onboarding");
  }, [router]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }

    const next = Math.min(index + 1, SLIDES.length - 1);
    setIndex(next);
    listRef.current?.scrollToOffset({
      offset: next * width,
      animated: true,
    });
  }, [finish, index, isLast, width]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      setIndex(Math.max(0, Math.min(next, SLIDES.length - 1)));
    },
    [width],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Logo />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={i18n.t("onboarding.skip")}
          disabled={isLast}
          hitSlop={12}
          onPress={finish}
          style={[styles.skipButton, isLast && styles.skipButtonHidden]}
        >
          <Text style={styles.skipText}>{i18n.t("onboarding.skip")}</Text>
        </Pressable>
      </View>

      <View
        style={styles.list}
        onLayout={(event) => setListHeight(event.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(slide) => slide.id}
          renderItem={({ item }) => (
            <OnboardingSlide
              slide={item}
              width={width}
              height={listHeight}
              compact={compact}
            />
          )}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, itemIndex) => ({
            length: width,
            offset: width * itemIndex,
            index: itemIndex,
          })}
          style={styles.list}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, dotIndex) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                dotIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={i18n.t(
            isLast ? "onboarding.start" : "onboarding.next",
          )}
          onPress={handleNext}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {i18n.t(isLast ? "onboarding.start" : "onboarding.next")}
          </Text>
          <MaterialIcons
            name={isLast ? "check" : "arrow-forward"}
            size={20}
            color={colors.onPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: C.surface,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    height: 56,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  skipButtonHidden: {
    opacity: 0,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.secondary,
  },
  list: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  slideInner: {
    flex: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 8,
  },
  illustration: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: "150%",
    height: "150%",
    borderRadius: 999,
    opacity: 0.06,
  },
  iconBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 26,
    elevation: 8,
  },
  eyebrow: {
    marginTop: 28,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: C.onSurface,
    textAlign: "center",
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  description: {
    marginTop: 10,
    maxWidth: 360,
    fontSize: 15,
    lineHeight: 23,
    color: C.onSurfaceVariant,
    textAlign: "center",
  },
  features: {
    marginTop: 22,
    width: "100%",
    maxWidth: 340,
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.secondaryContainer,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: C.onSurfaceVariant,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 10,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 18,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 26,
    backgroundColor: C.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: C.outlineVariant,
  },
  primaryButton: {
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
  primaryButtonPressed: {
    backgroundColor: C.primaryContainer,
    transform: [{ scale: 0.99 }],
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
