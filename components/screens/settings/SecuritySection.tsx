import { makeStyles } from "@/hooks/make-styles";
import { hasPin } from "@/lib/auth";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

function ToggleRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  onValueChange,
  borderTop,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  borderTop?: boolean;
}) {
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  return (
    <View style={[rowStyles.container, borderTop && rowStyles.borderTop]}>
      <View style={rowStyles.left}>
        <View style={[rowStyles.iconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={rowStyles.textWrap}>
          <Text style={rowStyles.title}>{title}</Text>
          <Text style={rowStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: C.surfaceContainerHighest, true: C.primary }}
        thumbColor={C.surfaceContainerLowest}
        ios_backgroundColor={C.surfaceContainerHighest}
      />
    </View>
  );
}

function NavRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
  borderTop,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  borderTop?: boolean;
}) {
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  return (
    <TouchableOpacity
      style={[rowStyles.container, borderTop && rowStyles.borderTop]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={rowStyles.left}>
        <View style={[rowStyles.iconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={rowStyles.textWrap}>
          <Text style={rowStyles.title}>{title}</Text>
          <Text style={rowStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={22}
        color={C.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
}

export function SecuritySection() {
  const styles = useStyles();
  const { colors: C } = useTheme();
  const router = useRouter();
  const [pinEnabled, setPinEnabled] = useState(true);
  const [pinExists, setPinExists] = useState(false);

  useEffect(() => {
    async function load() {
      const stored = await AsyncStorage.getItem("pinProtectionEnabled");
      setPinEnabled(stored === null ? true : stored === "true");
      const exists = await hasPin();
      setPinExists(exists);
    }
    load();
  }, []);

  const handlePinToggle = useCallback(async (v: boolean) => {
    setPinEnabled(v);
    await AsyncStorage.setItem("pinProtectionEnabled", v ? "true" : "false");
  }, []);

  const handlePinNav = useCallback(() => {
    router.push(pinExists ? ("/pin/setup" as any) : "/pin/unlock");
  }, [pinExists, router]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="security" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>{i18n.t(`security.title`)}</Text>
      </View>
      <View style={styles.card}>
        <ToggleRow
          icon="pin"
          iconBg={C.secondaryContainer}
          iconColor={C.onSecondaryContainer}
          title={i18n.t(`security.pinProtection`)}
          subtitle={i18n.t(`security.pinProtectionSubtitle`)}
          value={pinEnabled}
          onValueChange={handlePinToggle}
        />
        <NavRow
          icon="dialpad"
          iconBg={C.surfaceContainer}
          iconColor={C.secondary}
          title={
            pinExists ? i18n.t(`security.changePin`) : i18n.t(`security.setPin`)
          }
          subtitle={
            pinExists
              ? i18n.t(`security.changePinSubtitle`)
              : i18n.t(`security.setPinSubtitle`)
          }
          onPress={handlePinNav}
          borderTop
        />
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
