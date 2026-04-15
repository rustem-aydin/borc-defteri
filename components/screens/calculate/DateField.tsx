import { C } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  icon?: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  info?: string;
  placeholder?: string;
  keyboardType?: "numeric" | "default";
}

/** Auto-inserts dots for DD.MM.YYYY as user types */
function formatDateInput(raw: string, prev: string): string {
  // Remove non-digits
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
}

export default function DateField({
  label,
  icon,
  value,
  onChange,
  info,
  placeholder = "GG.AA.YYYY",
  keyboardType = "numeric",
}: Props) {
  const [focused, setFocused] = useState(false);

  function handleChange(raw: string) {
    onChange(formatDateInput(raw, value));
  }
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {info && <Text style={styles.infoIcon}>ⓘ</Text>}
      </View>
      <View
        style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={C.outline}
          keyboardType={keyboardType}
          maxLength={10}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: C.secondary,
  },
  infoIcon: {
    fontSize: 13,
    color: C.outline,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWrapperFocused: {
    borderColor: C.primary,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "500",
    color: C.onSurface,
  },
  icon: {
    paddingRight: 12,
    fontSize: 15,
  },
}));
