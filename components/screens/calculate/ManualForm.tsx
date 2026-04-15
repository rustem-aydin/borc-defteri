import { C, VAKIT_LABELS } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
// Import kısmından VAKIT_ICONS'u kaldırdık çünkü artık resimleri kullanacağız
import { ManualCounts } from "@/hooks/Usekazaform";
import { PRAYER_KEYS } from "@/lib/db";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Image, Text, TextInput, View } from "react-native";

const VAKIT_IMAGES: Record<string, any> = {
  sabah: require("@/assets/times/sabah.png"),
  ogle: require("@/assets/times/ogle.png"),
  ikindi: require("@/assets/times/ikindi.png"),
  aksam: require("@/assets/times/aksam.png"),
  yatsi: require("@/assets/times/yatsi.png"),
  vitir: require("@/assets/times/vitr.png"), // Dosya adını belirttiğiniz gibi vitr.png yazdım
};

interface Props {
  manual: ManualCounts;
  setManualField: (key: keyof ManualCounts, value: string) => void;
}

export default function ManualForm({ manual, setManualField }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      {/* Section header */}
      <Text style={styles.sectionLabel}>
        {i18n.t("manualForm.enterCounts")}
      </Text>

      {/* Info banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          <Text style={styles.infoBold}>{i18n.t("manualForm.tip")}</Text>
          {i18n.t("manualForm.tipMessage")}
        </Text>
      </View>

      <View style={styles.list}>
        {PRAYER_KEYS.map((key, i) => (
          <View
            key={key}
            style={[styles.row, i < PRAYER_KEYS.length - 1 && styles.rowBorder]}
          >
            <View style={styles.labelSide}>
              <View style={styles.vakit_iconWrap}>
                <Image source={VAKIT_IMAGES[key]} style={styles.vakit_image} />
              </View>
              <Text style={styles.vakit_label}>{VAKIT_LABELS[key]}</Text>
            </View>

            {/* Right: input + unit */}
            <View style={styles.inputSide}>
              <TextInput
                style={styles.input}
                value={manual[key as keyof ManualCounts]}
                onChangeText={(v) =>
                  setManualField(key as keyof ManualCounts, v)
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={C.outline}
                textAlign="center"
                maxLength={6}
              />
              <Text style={styles.unit}>{i18n.t("manualForm.prayerUnit")}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceLowest,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: C.secondary,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  infoBanner: {
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    padding: 12,
  },
  infoText: {
    fontSize: 11.5,
    color: C.secondary,
    lineHeight: 17,
  },
  infoBold: {
    fontWeight: "700",
    color: C.primary,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceHigh,
  },
  labelSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vakit_iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  // Eski vakit_icon (fontSize vs.) silindi, yerine vakit_image eklendi
  vakit_image: {
    width: 40,
    height: 40,
    resizeMode: "contain", // Resmin kutu dışına taşmadan oranını korumasını sağlar
  },
  vakit_label: {
    fontSize: 15,
    fontWeight: "600",
    color: C.onSurface,
  },
  inputSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: 84,
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: "700",
    color: C.onSurface,
  },
  unit: {
    fontSize: 11,
    color: C.outline,
    fontWeight: "500",
  },
}));
