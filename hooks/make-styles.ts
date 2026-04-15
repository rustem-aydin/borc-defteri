// hooks/makeStyles.ts
import { ColorScheme } from "@/constants/colors";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useColors } from "./useColors";

export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  fn: (colors: ColorScheme) => T,
) {
  return () => {
    const C = useColors();
    return useMemo(() => fn(C), [C]);
  };
}
