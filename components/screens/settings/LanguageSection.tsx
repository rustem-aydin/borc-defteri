import { makeStyles } from "@/hooks/make-styles";
import { changeLanguage, deviceLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

const LANGUAGES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

export function LanguageSection() {
  const styles = useStyles();
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState<LangCode>(
    (deviceLanguage as LangCode) ?? "tr",
  );

  const currentLang =
    LANGUAGES.find((l) => l.code === selectedCode) ?? LANGUAGES[0];

  const handleSelect = (code: LangCode) => {
    changeLanguage(code);
    setSelectedCode(code);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="language" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>Dil</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity
          style={rowStyles.container}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={rowStyles.left}>
            <View
              style={[
                rowStyles.iconWrap,
                { backgroundColor: C.secondaryContainer },
              ]}
            >
              <Text style={rowStyles.flag}>{currentLang.flag}</Text>
            </View>
            <View style={rowStyles.textWrap}>
              <Text style={rowStyles.title}>Uygulama Dili</Text>
              <Text style={rowStyles.subtitle}>{currentLang.label}</Text>
            </View>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={C.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: C.surfaceContainerLowest },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: C.onSurface }]}>
                Dil Seçin
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons
                  name="close"
                  size={22}
                  color={C.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            {LANGUAGES.map((lang, index) => {
              const isSelected = lang.code === selectedCode;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langRow,
                    index > 0 && {
                      borderTopWidth: 1,
                      borderTopColor: C.outlineVariant + "26",
                    },
                    isSelected && {
                      backgroundColor: C.primaryContainer + "33",
                    },
                  ]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.langLeft}>
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.langLabel,
                        { color: isSelected ? C.primary : C.onSurface },
                        isSelected && { fontFamily: "Manrope_700Bold" },
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <MaterialIcons name="check" size={20} color={C.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const useRowStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    marginRight: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flag: { fontSize: 20 },
  textWrap: { flex: 1 },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: C.onSurface,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
}));

const useStyles = makeStyles((C) => ({
  container: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: C.onSurface,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    overflow: "hidden",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant + "26",
  },
  sheetTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 17,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  langLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  langFlag: { fontSize: 24 },
  langLabel: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
    color: C.onSurface,
  },
}));
