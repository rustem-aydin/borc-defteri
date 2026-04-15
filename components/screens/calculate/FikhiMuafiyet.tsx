import { C } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  monthlyHayz: string;
  setMonthlyHayz: (v: string) => void;
  totalNifas: string;
  setTotalNifas: (v: string) => void;
}

function SmallField({
  label,
  value,
  onChange,
  unit,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  placeholder?: string;
}) {
  const sf = useStyless();

  return (
    <View style={sf.container}>
      <Text style={sf.label}>{label}</Text>
      <View style={sf.row}>
        <TextInput
          style={sf.input}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          textAlign="center"
          placeholder={placeholder || "0"}
          placeholderTextColor={C.outline}
          maxLength={4}
        />
        <Text style={sf.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const useStyless = makeStyles((C) => ({
  container: { flex: 1, gap: 8 },
  label: { fontSize: 12, fontWeight: "600", color: C.secondary },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    width: 72,
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    paddingVertical: 13,
    fontSize: 15,
    fontWeight: "600",
    color: C.onSurface,
  },
  unit: { fontSize: 11, fontWeight: "500", color: C.outline, flexShrink: 1 },
}));

export default function FikhiMuafiyet({
  monthlyHayz,
  setMonthlyHayz,
  totalNifas,
  setTotalNifas,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✦</Text>
        </View>
        <Text style={styles.title}>{i18n.t("fikhiExemption.title")}</Text>
      </View>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoDot}>●</Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>
            {i18n.t("fikhiExemption.infoLabel")}
          </Text>
          {i18n.t("fikhiExemption.infoText")}
        </Text>
      </View>

      {/* Inputs */}
      <View style={styles.row}>
        <SmallField
          label={i18n.t("fikhiExemption.monthlyPeriodDays")}
          value={monthlyHayz}
          onChange={setMonthlyHayz}
          unit={i18n.t("fikhiExemption.daysPerMonth")}
        />
        <View style={{ width: 16 }} />
        <SmallField
          label={i18n.t("fikhiExemption.totalNifasPeriod")}
          value={totalNifas}
          onChange={setTotalNifas}
          unit={i18n.t("fikhiExemption.totalDays")}
          placeholder="0"
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceLowest,
    borderRadius: 24,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: C.borderAccent,
    gap: 16,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    fontSize: 16,
    color: C.primary,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: C.primary,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: "flex-start",
  },
  infoDot: {
    fontSize: 8,
    color: C.primary,
    marginTop: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 11.5,
    color: C.secondary,
    lineHeight: 17,
  },
  infoBold: {
    fontWeight: "700",
    color: C.primary,
  },
  row: {
    flexDirection: "row",
  },
}));
