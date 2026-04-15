import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function CalculationSection() {
  const styles = useStyles();
  const { colors: C } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons
          name="format-list-numbered"
          size={22}
          color={C.primary}
        />
        <Text style={styles.sectionTitle}>{i18n.t(`calculation.title`)}</Text>
      </View>

      <Pressable
        onPress={() => router.push("/calculate")}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="calculate" size={24} color={C.primary} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.cardTitle}>
              {i18n.t(`calculation.detailedCalculation`)}
            </Text>
            <Text style={styles.cardHint}>
              {i18n.t(`calculation.calculateHint`)}
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={C.secondary} />
      </Pressable>
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
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPressed: {
    backgroundColor: C.surfaceContainerLow,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primaryFixed + "40",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: C.onSurface,
    marginBottom: 4,
  },
  cardHint: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },
}));
