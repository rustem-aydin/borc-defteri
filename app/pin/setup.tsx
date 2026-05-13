import { AppButton } from "@/components/ui/prressable";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { savePin } from "../../lib/auth";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Ekran boyutuna göre scale eden yardımcı fonksiyon
// 375px genişlik baz alınarak hesaplanır (iPhone SE / eski standart)
const BASE_WIDTH = 375;
const scale = SCREEN_W / BASE_WIDTH;
const normalize = (size: number) => Math.round(size * scale);

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
            style={styles.logoImage}
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
                    size={normalize(28)}
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: normalize(32),
    marginTop: normalize(64),
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  logoImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(20),
  },
  logoText: {
    fontSize: normalize(20),
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: C.primary,
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalize(32),
  },
  messageText: {
    color: C.onSurfaceVariant,
    fontSize: normalize(14),
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: normalize(40),
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(16),
    marginBottom: normalize(64),
    height: normalize(32),
  },
  dotWrapper: {
    width: normalize(32),
    height: normalize(32),
    alignItems: "center",
    justifyContent: "center",
  },
  dotActive: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: C.primaryContainer,
  },
  blobTopRight: {
    position: "absolute",
    top: 0,
    right: -normalize(120),
    width: normalize(320),
    height: normalize(320),
    borderRadius: 999,
    backgroundColor: "rgba(162,240,238,0.12)",
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: -normalize(120),
    width: normalize(320),
    height: normalize(320),
    borderRadius: 999,
    backgroundColor: "rgba(205,232,231,0.12)",
    zIndex: -1,
  },
  dotInactive: {
    width: normalize(14),
    height: normalize(14),
    borderRadius: normalize(7),
    backgroundColor: C.outlineVariant,
  },
  keypadContainer: {
    width: normalize(280),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: normalize(24),
  },
  keyWrapper: {
    width: normalize(80),
    alignItems: "center",
    justifyContent: "center",
  },
  keyButton: {
    width: normalize(64),
    height: normalize(64),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalize(32),
    backgroundColor: C.surfaceContainerHigh,
  },
  keyText: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: C.primary,
    marginBottom: normalize(4),
  },
  bottomSpacer: {
    marginTop: normalize(48),
    width: normalize(56),
    height: normalize(56),
  },
}));
