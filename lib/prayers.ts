import { i18n } from "./i18n";

export const PRAYER_KEYS = [
  "sabah",
  "ogle",
  "ikindi",
  "aksam",
  "yatsi",
  "vitir",
] as const;

export type PrayerKey = (typeof PRAYER_KEYS)[number];

export interface PrayerMetadata {
  color: string;
  image: ReturnType<typeof require>;
}

const STATIC_METADATA: Record<PrayerKey, PrayerMetadata> = {
  sabah: {
    color: "#ecd4d3",
    image: require("@/assets/times/sabah.png"),
  },
  ogle: {
    color: "#fce474",
    image: require("@/assets/times/ogle.png"),
  },
  ikindi: {
    color: "#febe9b",
    image: require("@/assets/times/ikindi.png"),
  },
  aksam: {
    color: "#db6165",
    image: require("@/assets/times/aksam.png"),
  },
  yatsi: {
    color: "#161a64",
    image: require("@/assets/times/yatsi.png"),
  },
  vitir: {
    color: "#1d467f",
    image: require("@/assets/times/vitr.png"),
  },
};

export function getPrayerMetadata(key: PrayerKey): PrayerMetadata & { label: string } {
  return {
    ...STATIC_METADATA[key],
    label: i18n.t(`diger.vakitler.${key}`),
  };
}
