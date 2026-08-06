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
  label: string;
  color: string;
  image: ReturnType<typeof require>;
}

export const PRAYER_METADATA: Record<PrayerKey, PrayerMetadata> = {
  sabah: {
    label: i18n.t("diger.vakitler.sabah"),
    color: "#ecd4d3",
    image: require("@/assets/times/sabah.png"),
  },
  ogle: {
    label: i18n.t("diger.vakitler.ogle"),
    color: "#fce474",
    image: require("@/assets/times/ogle.png"),
  },
  ikindi: {
    label: i18n.t("diger.vakitler.ikindi"),
    color: "#febe9b",
    image: require("@/assets/times/ikindi.png"),
  },
  aksam: {
    label: i18n.t("diger.vakitler.aksam"),
    color: "#db6165",
    image: require("@/assets/times/aksam.png"),
  },
  yatsi: {
    label: i18n.t("diger.vakitler.yatsi"),
    color: "#161a64",
    image: require("@/assets/times/yatsi.png"),
  },
  vitir: {
    label: i18n.t("diger.vakitler.vitir"),
    color: "#1d467f",
    image: require("@/assets/times/vitr.png"),
  },
};
