import { Tab } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "auto", label: i18n.t("calculation.autoTab") },
  { key: "manual", label: i18n.t("calculation.manualTab") },
];

export default function TabBar({ active, onChange }: Props) {
  const animX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animX, {
      toValue: active === "auto" ? 0 : 1,
      useNativeDriver: false,
      tension: 120,
      friction: 14,
    }).start();
  }, [active]);

  const indicatorLeft = animX.interpolate({
    inputRange: [0, 1],
    outputRange: ["12.5%", "62.5%"],
  });
  const styles = useStyles();

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
        <Animated.View style={[styles.indicator, { left: indicatorLeft }]} />
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
    width: "25%",
    height: 3.5,
    backgroundColor: C.primary,
    borderRadius: 99,
  },
}));
