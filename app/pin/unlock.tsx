import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verifyPin } from "../../lib/auth";

export default function PinUnlock() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (pin.length === 4) {
      handleVerify();
    }
  }, [pin]);

  const handleVerify = async () => {
    const isValid = await verifyPin(pin);
    if (isValid) {
      router.replace("/home");
    } else {
      Alert.alert(i18n.t("pinLock.error"), i18n.t("pinLock.incorrectPin"), [
        { text: i18n.t("pinLock.ok"), onPress: () => setPin("") },
      ]);
    }
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
  const styles = useStyles();

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

      {/* Ana İçerik */}
      <View style={styles.content}>
        {/* Mesaj (Kilit Açma) */}
        <Text style={styles.messageText}>{i18n.t("pinLock.openApp")}</Text>

        {/* PIN Noktaları */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((i) => {
            const isActive = i < pin.length;
            return (
              <View key={i} style={styles.dotWrapper}>
                {isActive ? (
                  <View style={styles.dotActive} />
                ) : (
                  <View style={styles.dotInactive} />
                )}
              </View>
            );
          })}
        </View>

        {/* Tuş Takımı */}
        <View style={styles.keypadContainer}>
          {padKeys.map((k, index) => (
            <View key={index} style={styles.keyWrapper}>
              {k === "" ? null : k === "backspace" ? (
                <TouchableOpacity
                  onPress={() => handlePress(k)}
                  style={styles.keyButton}
                  activeOpacity={0.6}
                >
                  <MaterialIcons name="backspace" size={28} color="#004d4c" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handlePress(k)}
                  style={styles.keyButton}
                  activeOpacity={0.6}
                >
                  <Text style={styles.keyText}>{k}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7faf9",
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
    color: "#004d4c",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  messageText: {
    color: "#4b6363",
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
    backgroundColor: "#004d4c",
    borderWidth: 3,
    borderColor: "rgba(162, 240, 238, 0.4)",
  },
  dotInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(190, 201, 200, 0.4)",
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
    backgroundColor: "rgba(0, 77, 76, 0.02)",
  },
  keyText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#004d4c",
    marginBottom: 4,
  },
  biometricContainer: {
    marginTop: 48,
    alignItems: "center",
    gap: 12,
  },
  blobTopRight: {
    position: "absolute",
    top: 80,
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
  biometricButton: {
    width: 56,
    height: 56,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#004d4c",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  biometricText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#4b6363",
    marginTop: 8,
  },
}));
