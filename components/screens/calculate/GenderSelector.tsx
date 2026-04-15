import { Gender } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  value: Gender;
  onChange: (g: Gender) => void;
}

const OPTIONS: { key: Gender; label: string; icon: string }[] = [
  { key: "erkek", label: i18n.t("gender.male"), icon: "♂" },
  { key: "kadin", label: i18n.t("gender.female"), icon: "♀" },
];

export default function GenderSelector({ value, onChange }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>{i18n.t("gender.title")}</Text>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const isActive = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.btn, isActive && styles.btnActive]}
              onPress={() => onChange(opt.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {opt.icon}
              </Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: C.secondary,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    backgroundColor: C.surfaceLow,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  btnActive: {
    backgroundColor: C.primary,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    fontSize: 18,
    color: C.secondary,
  },
  iconActive: {
    color: C.white,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: C.secondary,
  },
  labelActive: {
    color: C.white,
    fontWeight: "700",
  },
}));
