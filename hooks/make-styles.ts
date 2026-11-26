// hooks/makeStyles.ts
import { ColorScheme } from "@/constants/colors";
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { useColors } from "./useColors";

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;

// RN 0.88 kaldırdı: StyleSheet.NamedStyles. Eşdeğer kısıt yerel tanımlanır.
export function makeStyles<T extends NamedStyles>(
  fn: (colors: ColorScheme) => T,
) {
  // Tema başına tek stil nesnesi: her bileşen örneği yeniden üretmez.
  const cache = new WeakMap<ColorScheme, T>();

  return () => {
    const C = useColors();
    let styles = cache.get(C);
    if (!styles) {
      styles = StyleSheet.create(fn(C)) as T;
      cache.set(C, styles);
    }
    return styles;
  };
}
