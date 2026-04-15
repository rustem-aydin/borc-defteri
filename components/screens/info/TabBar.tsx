import { TabInfo } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface Props {
  active: TabInfo;
  onChange: (tab: TabInfo) => void;
}

const TABS: { key: TabInfo; label: string }[] = [
  { key: "hanefi", label: i18n.t("info.tabs.hanefi") },
  { key: "safii", label: i18n.t("info.tabs.safii") },
  { key: "hanbeli", label: i18n.t("info.tabs.maliki") },
  { key: "maliki", label: i18n.t("info.tabs.hanbeli") },
];

// Sekme indekslerini almak için yardımcı fonksiyon
const getTabIndex = (tab: TabInfo): number => {
  return TABS.findIndex((t) => t.key === tab);
};

export default function TabBarInfo({ active, onChange }: Props) {
  const styles = useStyles();
  const { colors: C } = useTheme();
  const animX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeIndex = getTabIndex(active);
    Animated.spring(animX, {
      toValue: activeIndex,
      useNativeDriver: false,
      tension: 120,
      friction: 14,
    }).start();
  }, [active]);

  const indicatorLeft = animX.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ["12.5%", "37.5%", "62.5%", "87.5%"],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.75}
          >
            <Text
              style={[styles.label, active === tab.key && styles.labelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              left: indicatorLeft,
              backgroundColor: C.primary,
              transform: [{ translateX: "-50%" }], // Göstergeyi ortala
            },
          ]}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: C.surfaceHigh,
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingBottom: 14,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: C.secondary,
  },
  labelActive: {
    color: C.primary,
    fontWeight: "800",
  },
  indicator: {
    position: "absolute",
    bottom: -2,
    width: "15%",
    height: 3.5,
    borderRadius: 99,
  },
}));
