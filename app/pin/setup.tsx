import { AppButton } from "@/components/ui/prressable";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { savePin } from "../../lib/auth";

export default function PinSetup() {
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const styles = useStyles();

  useEffect(() => {
    if (pin.length === 4) {
      if (step === 1) {
        setFirstPin(pin);
        setPin("");
        setStep(2);
      } else {
        if (pin === firstPin) {
          handleSave();
        } else {
          Alert.alert(
            i18n.t("pinSetup.error"),
            i18n.t("pinSetup.pinMismatch"),
            [
              {
                text: i18n.t("pinSetup.ok"),
                onPress: () => {
                  setPin("");
                  setFirstPin("");
                  setStep(1);
                },
              },
            ],
          );
        }
      }
    }
  }, [pin]);

  const handleSave = async () => {
    await savePin(pin);
    router.replace("/home");
  };

  const handlePress = (key: string) => {
    if (key === "backspace") {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4 && key !== "") {
      setPin((prev) => prev + key);
    }
  };

  const padKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "",
    "0",
    "backspace",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            style={{ width: 120, height: 120, borderRadius: 20 }}
            source={require("@/assets/logo1.png")}
            contentFit="contain"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.messageText}>
          {step === 1
            ? i18n.t("pinSetup.createPin")
            : i18n.t("pinSetup.confirmPin")}
        </Text>

        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((i) => {
            const isActive = i < pin.length;
            return (
              <View key={i} style={styles.dotWrapper}>
                <View
                  style={isActive ? styles.dotActive : styles.dotInactive}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.keypadContainer}>
          {padKeys.map((k, index) => (
            <View key={index} style={styles.keyWrapper}>
              {k === "" ? null : k === "backspace" ? (
                <Pressable
                  onPress={() => handlePress(k)}
                  style={styles.keyButton}
                >
                  <MaterialIcons
                    name="backspace"
                    size={28}
                    color={styles._colors.primary}
                  />
                </Pressable>
              ) : (
                <AppButton variant="key-button" onPress={() => handlePress(k)}>
                  <Text style={styles.keyText}>{String(k)}</Text>
                </AppButton>
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </View>
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}
const useStyles = makeStyles((C) => ({
  _colors: C as any,
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center", // "space-between" yerine
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 64,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: C.primary,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  messageText: {
    color: C.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 40,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 64,
    height: 32,
  },
  dotWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: C.primaryContainer, // Aktif noktada hafif bir halka efekti
  },
  blobTopRight: {
    position: "absolute",
    top: 0,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(162,240,238,0.12)",
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(205,232,231,0.12)",
    zIndex: -1,
  },
  dotInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.outlineVariant, // Pasif noktalar için daha belirgin ama yumuşak bir ton
  },
  keypadContainer: {
    width: 280,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 24,
  },
  keyWrapper: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  keyButton: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor: C.surfaceContainerHigh,
  },
  keyText: {
    fontSize: 32,
    fontWeight: "bold",
    color: C.primary,
    marginBottom: 4,
  },
  bottomSpacer: {
    marginTop: 48,
    width: 56,
    height: 56,
  },
}));
