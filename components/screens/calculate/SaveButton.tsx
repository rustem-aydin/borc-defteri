import { C } from "@/constants/colors";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  label: string;
  onPress: () => Promise<void> | void;
  loading?: boolean;
  eventName?: string;
}

export default function SaveButton({
  label,
  onPress,
  loading: externalLoading = false,
  eventName = "PrayersUpdated",
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading || internalLoading;

  function handlePressIn() {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
    }).start();
  }

  async function handlePress() {
    if (loading) return;

    setInternalLoading(true);
    try {
      await onPress();
      DeviceEventEmitter.emit(eventName);
    } catch (error) {
      console.error("SaveButton error:", error);
    } finally {
      setInternalLoading(false);
    }
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.btn}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={C.white} />
        ) : (
          <>
            <Text style={styles.icon}>⊕</Text>
            <Text style={styles.label}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.note}>
        Hesaplama sonuçları profilinize otomatik olarak kaydedilecektir.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: C.primary,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: {
    fontSize: 20,
    color: C.white,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.2,
  },
  note: {
    textAlign: "center",
    fontSize: 11,
    color: C.outline,
    fontStyle: "italic",
    marginTop: 10,
  },
});
