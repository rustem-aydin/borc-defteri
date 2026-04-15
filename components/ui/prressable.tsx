import { makeStyles } from "@/hooks/make-styles";
import React from "react";
import { Pressable, Text, View } from "react-native";

type AppButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onPress: () => void;
  variant: "add" | "remove" | "key-button" | "icon-button";
  disabled?: boolean;
};

export function AppButton({
  label,
  children,
  onPress,
  variant,
  disabled = false,
}: AppButtonProps) {
  const styles = useStyles();

  const variantStyle = {
    remove: styles.removeBtn,
    add: styles.addBtn,
    "key-button": styles.keyButton,
    "icon-button": styles.iconBtn,
  }[variant];

  const pressedStyle = {
    remove: styles.removeBtnPressed,
    add: styles.addBtnPressed,
    "key-button": styles.keyButtonPressed,
    "icon-button": styles.iconBtnPressed,
  }[variant];

  const labelStyle = {
    remove: styles.removeBtnLabel,
    add: styles.addBtnLabel,
    "key-button": styles.addBtnLabel,
    "icon-button": styles.addBtnLabel,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        pressed && pressedStyle,
        disabled && styles.disabled,
      ]}
    >
      {children ?? <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </Pressable>
  );
}

export default function ButtonRow() {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <AppButton
        variant="remove"
        label="Sil"
        onPress={() => console.log("sil")}
      />
      <AppButton
        variant="add"
        label="Ekle"
        onPress={() => console.log("ekle")}
      />
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  base: {
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // remove
  removeBtn: {
    flex: 2,
    backgroundColor: C.primary,
  },
  removeBtnPressed: {
    backgroundColor: C.primaryContainer,
    transform: [{ scale: 0.97 }],
  },
  removeBtnLabel: {
    color: C.onPrimary,
    fontWeight: "600",
  },
  // add
  addBtn: {
    flex: 1,
    backgroundColor: C.secondaryContainer,
  },
  addBtnPressed: {
    backgroundColor: C.secondaryFixedDim,
    transform: [{ scale: 0.97 }],
  },
  addBtnLabel: {
    color: C.primary,
    fontWeight: "600",
  },
  // key-button
  keyButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.borderAccent,
  },
  keyButtonPressed: {
    backgroundColor: C.shadow,
    transform: [{ scale: 0.95 }],
  },
  // icon-button
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  iconBtnPressed: {
    backgroundColor: C.borderAccent,
    transform: [{ scale: 0.93 }],
  },
  // ortak
  label: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
}));
