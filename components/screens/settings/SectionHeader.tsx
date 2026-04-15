import { makeStyles } from "@/hooks/make-styles";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SectionHeaderProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  const styles = useStyles();
  const { colors: C } = useTheme();

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={24} color={C.primary} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    marginLeft: 8,
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: C.onSurface,
  },
}));
