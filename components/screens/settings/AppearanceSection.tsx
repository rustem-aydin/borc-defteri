// components/AppearanceSection.tsx
import { C } from "@/constants/colors";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "./SectionHeader";

type ThemeOption = "light" | "dark" | "system";

interface ThemeButtonProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selected: boolean;
  previewDark?: boolean;
  onPress: () => void;
  colors: typeof C;
}

function ThemeButton({
  label,
  icon,
  selected,
  previewDark,
  onPress,
  colors,
}: ThemeButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeButton,
        {
          backgroundColor: colors.surfaceContainerLow,
          borderColor: selected ? colors.primary : "transparent",
        },
        pressed && !selected && { backgroundColor: colors.surfaceContainer },
      ]}
    >
      <View
        style={[
          styles.themePreview,
          {
            backgroundColor: previewDark
              ? "#1a2020"
              : previewDark === false
                ? colors.surfaceBright
                : colors.surfaceContainerHigh,
          },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color={
            previewDark
              ? "#86d4d2"
              : selected
                ? colors.primary
                : colors.onSurfaceVariant
          }
        />
      </View>
      <Text
        style={[
          styles.themeLabel,
          { color: selected ? colors.primary : colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function AppearanceSection() {
  const { mode, setMode, colors } = useTheme();

  const options: {
    key: ThemeOption;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    previewDark?: boolean;
  }[] = [
    {
      key: "light",
      label: i18n.t(`appearance.light`),
      icon: "light-mode",
      previewDark: false,
    },
    {
      key: "dark",
      label: i18n.t(`appearance.dark`),
      icon: "dark-mode",
      previewDark: true,
    },
    {
      key: "system",
      label: i18n.t(`appearance.system`),
      icon: "brightness-auto",
    },
  ];

  return (
    <View style={styles.container}>
      <SectionHeader icon="palette" title={i18n.t(`appearance.title`)} />
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceContainerLowest },
        ]}
      >
        <Text style={[styles.label, { color: colors.secondary }]}>
          {i18n.t(`appearance.interfaceTheme`)}
        </Text>
        <View style={styles.themeGrid}>
          {options.map((opt) => (
            <ThemeButton
              key={opt.key}
              label={opt.label}
              icon={opt.icon}
              selected={mode === opt.key}
              previewDark={opt.previewDark}
              onPress={() => setMode(opt.key)}
              colors={colors}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  card: {
    borderRadius: 16,
    padding: 24,
    overflow: "hidden",
  },
  label: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: "row",
    gap: 12,
  },
  themeButton: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  themePreview: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  themeLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 11,
  },
});
