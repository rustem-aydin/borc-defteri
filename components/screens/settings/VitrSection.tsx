import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter, Switch, Text, View } from "react-native";

export const VITR_ENABLED_KEY = "@vitr_enabled";

export function VitrSection() {
  const styles = useStyles();
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();
  const [vitrEnabled, setVitrEnabled] = useState(true);

  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem(VITR_ENABLED_KEY);
      setVitrEnabled(stored === null ? true : stored === "true");
    }
    load();
  }, []);

  const handleToggle = useCallback(async (v: boolean) => {
    setVitrEnabled(v);
    await AsyncStorage.setItem(VITR_ENABLED_KEY, v ? "true" : "false");
    DeviceEventEmitter.emit("VitrUpdated");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="view-column" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>{i18n.t(`vitr.title`)}</Text>
      </View>
      <View style={styles.card}>
        <View style={rowStyles.container}>
          <View style={rowStyles.left}>
            <View
              style={[
                rowStyles.iconWrap,
                { backgroundColor: C.primaryContainer },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={20}
                color={C.onPrimaryContainer}
              />
            </View>
            <View style={rowStyles.textWrap}>
              <Text style={rowStyles.title}>{i18n.t(`vitr.countVitr`)}</Text>
              <Text style={rowStyles.subtitle}>
                {i18n.t(`vitr.countVitrSubtitle`)}
              </Text>
            </View>
          </View>
          <Switch
            value={vitrEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: C.surfaceContainerHighest, true: C.primary }}
            thumbColor={C.surfaceContainerLowest}
            ios_backgroundColor={C.surfaceContainerHighest}
          />
        </View>
      </View>
    </View>
  );
}

const useRowStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
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
  textWrap: { flex: 1 },
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
}));

const useStyles = makeStyles((C) => ({
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
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
  },
}));
