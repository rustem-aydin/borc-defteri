import { Header } from "@/components/Header";
import AutoForm from "@/components/screens/calculate/AutoForm";
import ManualForm from "@/components/screens/calculate/ManualForm";
import SaveButton from "@/components/screens/calculate/SaveButton";
import TabBar from "@/components/screens/calculate/TabBar";
import { makeStyles } from "@/hooks/make-styles";
import { useKazaForm } from "@/hooks/Usekazaform";
import { i18n } from "@/lib/i18n";
import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KazaHesaplaScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const {
    activeTab,
    setActiveTab,
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
    manual,
    setManualField,
    handleSave,
    loading,
  } = useKazaForm(() => {
    navigation.goBack();
  });

  // Scroll to top when switching tabs
  function handleTabChange(tab: "auto" | "manual") {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={i18n.t("headers.hesaplama")} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Page heading ── */}
          <View style={styles.heading}>
            <Text style={styles.headingTitle}>
              {i18n.t("calculation.determineDebt")}
            </Text>
            <Text style={styles.headingSubtitle}>
              {i18n.t("calculation.determineDebtSubtitle")}
            </Text>
          </View>

          <TabBar active={activeTab} onChange={handleTabChange} />

          {/* ── Forms ── */}
          <View style={styles.formArea}>
            {activeTab === "auto" ? (
              <AutoForm
                gender={gender}
                setGender={setGender}
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                pubertyAge={pubertyAge}
                setPubertyAge={setPubertyAge}
                regularDate={regularDate}
                setRegularDate={setRegularDate}
                monthlyHayz={monthlyHayz}
                setMonthlyHayz={setMonthlyHayz}
                totalNifas={totalNifas}
                setTotalNifas={setTotalNifas}
              />
            ) : (
              <ManualForm manual={manual} setManualField={setManualField} />
            )}
          </View>

          {/* ── Save Button ── */}
          <View style={styles.saveBtnWrapper}>
            <SaveButton
              label={
                activeTab === "auto"
                  ? i18n.t("calculation.calculateAndSave")
                  : i18n.t("calculation.save")
              }
              onPress={handleSave}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Decorative blobs */}
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    gap: 0,
  },
  heading: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    gap: 6,
  },
  headingTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: C.primary,
    letterSpacing: -0.8,
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-black" }),
  },
  headingSubtitle: {
    fontSize: 13,
    color: C.secondary,
    lineHeight: 19,
    maxWidth: "88%",
  },

  formArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  saveBtnWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  blobTopRight: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(162,240,238,0.12)",
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(205,232,231,0.12)",
    zIndex: -1,
  },
}));
