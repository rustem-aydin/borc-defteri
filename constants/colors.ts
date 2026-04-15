import { i18n } from "@/lib/i18n";

export const C = {
  primary: "#004d4c",
  primaryContainer: "#006766",
  primaryFixed: "#eefaf8",
  onPrimary: "#ffffff",
  secondary: "#4b6363",
  secondaryContainer: "#cde8e7",
  onSecondaryContainer: "#334b4b",
  tertiary: "#841e00",
  tertiaryFixed: "#ffdbd1",
  surface: "#f7faf9",
  surfaceWhite: "#ffffff",
  surfaceLow: "#f1f4f3",
  surfaceContainer: "#ebeeed",
  surfaceHighest: "#e0e3e2",
  onSurface: "#181c1c",
  onSurfaceVariant: "#3e4948",
  outline: "#6f7978",
  primaryLight: "#006766",
  surfaceHigh: "#e6e9e8",
  surfaceLowest: "#ffffff",
  outlineVariant: "#bec9c8",
  popover: "#F2F2F7",
  border: "#C6C6C8",
  white: "#ffffff",
  error: "#ba1a1a",
  borderAccent: "rgba(0,77,76,0.18)",
  shadow: "rgba(0,77,76,0.12)",
  primaryFixedDim: "#86d4d2",
  onPrimaryFixed: "#00201f",
  onPrimaryFixedVariant: "#00504f",
  onPrimaryContainer: "#94e2e0",
  inversePrimary: "#86d4d2",

  onSecondary: "#ffffff",
  secondaryFixed: "#cde8e7",
  secondaryFixedDim: "#b2cbcb",
  onSecondaryFixed: "#061f1f",
  onSecondaryFixedVariant: "#334b4b",

  onTertiary: "#ffffff",
  tertiaryContainer: "#ae2b00",
  onTertiaryContainer: "#ffc9bb",
  tertiaryFixedDim: "#ffb5a1",
  onTertiaryFixed: "#3b0800",
  onTertiaryFixedVariant: "#881f00",

  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  background: "#f7faf9",
  onBackground: "#181c1c",
  surfaceBright: "#f7faf9",
  surfaceDim: "#d7dbda",
  surfaceVariant: "#e0e3e2",
  inverseSurface: "#2c3131",
  inverseOnSurface: "#eef1f0",

  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f1f4f3",
  surfaceContainerHigh: "#e6e9e8",
  surfaceContainerHighest: "#e0e3e2",

  surfaceTint: "#076968",
} as const;
export const VAKIT_LABELS: Record<string, string> = {
  sabah: i18n.t("diger.vakitler.sabah"),
  ogle: i18n.t("diger.vakitler.ogle"),
  ikindi: i18n.t("diger.vakitler.ikindi"),
  aksam: i18n.t("diger.vakitler.aksam"),
  yatsi: i18n.t("diger.vakitler.yatsi"),
  vitir: i18n.t("diger.vakitler.vitir"),
};

export type Gender = "erkek" | "kadin";
export type Tab = "auto" | "manual";
export type TabInfo = "hanefi" | "safii" | "maliki" | "hanbeli";
export interface TabInfoProps {
  mezhep: TabInfo; // Buraya sadece 'hanefi' veya 'safii' gelebilir
}

export const DARK = {
  primary: "#86d4d2",
  primaryContainer: "#00504f",
  primaryFixed: "#eefaf8",
  onPrimary: "#00201f",
  secondary: "#b2cbcb",
  secondaryContainer: "#334b4b",
  onSecondaryContainer: "#cde8e7",
  tertiary: "#ffb5a1",
  tertiaryFixed: "#ffdbd1",
  surface: "#0f1414",
  surfaceWhite: "#1a2020",
  surfaceLow: "#151c1c",
  surfaceContainer: "#1d2424",
  surfaceHighest: "#2c3535",
  onSurface: "#e0e3e2",
  onSurfaceVariant: "#bec9c8",
  outline: "#889392",
  primaryLight: "#86d4d2",
  surfaceHigh: "#252d2d",
  surfaceLowest: "#0f1414",
  outlineVariant: "#3e4948",
  popover: "#1d2424",
  border: "#3e4948",
  white: "#ffffff",
  error: "#ffb4ab",
  borderAccent: "rgba(134,212,210,0.18)",
  shadow: "rgba(0,0,0,0.4)",
  primaryFixedDim: "#86d4d2",
  onPrimaryFixed: "#00201f",
  onPrimaryFixedVariant: "#00504f",
  onPrimaryContainer: "#86d4d2",
  inversePrimary: "#006766",

  onSecondary: "#1a2c2c",
  secondaryFixed: "#cde8e7",
  secondaryFixedDim: "#b2cbcb",
  onSecondaryFixed: "#061f1f",
  onSecondaryFixedVariant: "#cde8e7",

  onTertiary: "#561400",
  tertiaryContainer: "#7a1500",
  onTertiaryContainer: "#ffb5a1",
  tertiaryFixedDim: "#ffb5a1",
  onTertiaryFixed: "#3b0800",
  onTertiaryFixedVariant: "#ae2b00",

  onError: "#690005",
  errorContainer: "#93000a",
  onErrorContainer: "#ffb4ab",

  background: "#0f1414",
  onBackground: "#e0e3e2",
  surfaceBright: "#343b3b",
  surfaceDim: "#0f1414",
  surfaceVariant: "#3e4948",
  inverseSurface: "#e0e3e2",
  inverseOnSurface: "#2c3131",

  surfaceContainerLowest: "#0a0f0f",
  surfaceContainerLow: "#171d1d",
  surfaceContainerHigh: "#252d2d",
  surfaceContainerHighest: "#2f3636",

  surfaceTint: "#86d4d2",
} as const;

export type ColorScheme = typeof C;
