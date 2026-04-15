import { C, Gender } from "@/constants/colors";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import React from "react";
import { Text, TextInput, View } from "react-native";
import DateField from "./DateField";
import FikhiMuafiyet from "./FikhiMuafiyet";
import GenderSelector from "./GenderSelector";

interface Props {
  gender: Gender;
  setGender: (g: Gender) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  pubertyAge: string;
  setPubertyAge: (v: string) => void;
  regularDate: string;
  setRegularDate: (v: string) => void;
  monthlyHayz: string;
  setMonthlyHayz: (v: string) => void;
  totalNifas: string;
  setTotalNifas: (v: string) => void;
}

export default function AutoForm({
  gender,
  setGender,
  birthDate,
  setBirthDate,
  pubertyAge,
  setPubertyAge,
  regularDate,
  setRegularDate,
  monthlyHayz,
  setMonthlyHayz,
  totalNifas,
  setTotalNifas,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <GenderSelector value={gender} onChange={setGender} />

        <View style={styles.divider} />

        <View style={styles.dateRow}>
          <DateField
            label={i18n.t(`autoForm.dateOfBirth`)}
            icon="📅"
            value={birthDate}
            onChange={setBirthDate}
          />
          <View style={{ width: 12 }} />
          <DateField
            label={i18n.t(`autoForm.startedRegularPrayers`)}
            icon="✅"
            value={regularDate}
            onChange={setRegularDate}
          />
        </View>

        <View style={styles.divider} />

        {/* Puberty Age */}
        <View style={styles.pubertyRow}>
          <View style={styles.pubertyLabelRow}>
            <Text style={styles.fieldLabel}>
              {i18n.t(`autoForm.ageOfPuberty`)}
            </Text>
            <Text style={styles.infoHint}>
              {i18n.t(`autoForm.pubertyHint`)}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={pubertyAge}
            onChangeText={setPubertyAge}
            placeholder={i18n.t(`autoForm.defaultAge`)}
            placeholderTextColor={C.outline}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>

      {/* Card 2: Fıkhî muafiyet – only for women */}
      {gender === "kadin" && (
        <FikhiMuafiyet
          monthlyHayz={monthlyHayz}
          setMonthlyHayz={setMonthlyHayz}
          totalNifas={totalNifas}
          setTotalNifas={setTotalNifas}
        />
      )}
    </View>
  );
}
const useStyles = makeStyles((C) => ({
  wrapper: {
    gap: 14,
  },
  card: {
    backgroundColor: C.surfaceLowest,
    borderRadius: 24,
    padding: 20,
    gap: 18,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: C.surfaceHigh,
    marginHorizontal: -4,
  },
  dateRow: {
    flexDirection: "row",
  },
  pubertyRow: {
    gap: 8,
  },
  pubertyLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.secondary,
  },
  infoHint: {
    fontSize: 10,
    color: C.outline,
    flexShrink: 1,
    textAlign: "right",
  },
  input: {
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "500",
    color: C.onSurface,
  },
}));
