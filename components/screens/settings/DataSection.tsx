import { C } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function DataCard({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

export function DataSection() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="dns" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>Veri</Text>
      </View>
      <View style={styles.grid}>
        <DataCard
          icon="cloud-upload"
          iconBg={C.secondaryContainer}
          iconColor={C.onSecondaryContainer}
          title="Bulut Yedekleme"
          subtitle="Verilerinizi cihazlar arasında senkronize edin"
        />
        <DataCard
          icon="download"
          iconBg={C.surfaceContainer}
          iconColor={C.secondary}
          title="Kayıtları Dışa Aktar"
          subtitle="Namaz geçmişinizi PDF olarak indirin"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
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
  grid: { flexDirection: "row", gap: 16 },
  card: {
    flex: 1,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
  },
  cardPressed: {
    backgroundColor: C.surfaceContainerLow,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: C.onSurface,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
});
