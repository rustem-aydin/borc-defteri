import { C } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface ToggleRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  borderTop?: boolean;
}

export function ToggleRow({
  icon,
  iconBg = C.surfaceContainer,
  iconColor = C.secondary,
  title,
  subtitle,
  value,
  onValueChange,
  borderTop,
}: ToggleRowProps) {
  return (
    <View style={[styles.container, borderTop && styles.borderTop]}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: C.surfaceContainerHighest,
          true: C.primary,
        }}
        thumbColor={C.surfaceContainerLowest}
        ios_backgroundColor={C.surfaceContainerHighest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + "26",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    marginRight: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: C.onSurface,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
});
