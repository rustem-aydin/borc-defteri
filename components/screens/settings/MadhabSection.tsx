import { makeStyles } from "@/hooks/make-styles";
import { useMadhab } from "@/hooks/useMadhab";
import { i18n } from "@/lib/i18n";
import { MADHABS } from "@/lib/madhab";
import { useTheme } from "@/lib/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function MadhabSection() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { madhab, ready, setMadhab } = useMadhab();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="menu-book" size={22} color={colors.primary} />
        <Text style={styles.sectionTitle}>{i18n.t("madhab.title")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{i18n.t("madhab.settingsLabel")}</Text>
        <View style={styles.options}>
          {MADHABS.map((option) => {
            const selected = madhab === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                disabled={!ready}
                onPress={() => setMadhab(option)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: colors.surfaceContainerLow,
                    borderColor: selected
                      ? colors.primary
                      : "transparent",
                  },
                  pressed && !selected && styles.optionPressed,
                ]}
              >
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={selected ? colors.primary : colors.outlineVariant}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    { color: selected ? colors.primary : colors.onSurface },
                  ]}
                >
                  {i18n.t(`madhab.${option}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hint}>{i18n.t("madhab.settingsSubtitle")}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: C.onSurface,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    overflow: "hidden",
  },
  label: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: C.secondary,
    marginBottom: 16,
  },
  options: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionPressed: {
    backgroundColor: C.surfaceContainer,
  },
  optionLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
  },
  hint: {
    marginTop: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: C.onSurfaceVariant,
  },
}));
