import { makeStyles } from "@/hooks/make-styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View } from "react-native";

// ============================================================================
// 1. İLLÜSTRASYON BİLEŞENİ
// ============================================================================
const SpiritualIllustration = ({ styles }: { styles: any }) => {
  const C = styles._colors;
  return (
    <View style={styles.illustrationContainer}>
      <View style={styles.glowBackground} />

      <LinearGradient
        colors={[C.primary, C.primaryFixed ?? C.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerBox}
      >
        <MaterialCommunityIcons
          name="mosque"
          size={72}
          color={C.onPrimary}
          style={styles.centerIcon}
        />
      </LinearGradient>

      <View style={[styles.floatingBadge, styles.topRightBadge]}>
        <MaterialIcons name="bedtime" size={24} color={C.primary} />
      </View>

      <View style={[styles.floatingBadge, styles.bottomLeftBadge]}>
        <MaterialIcons name="calculate" size={32} color={C.tertiary} />
      </View>
    </View>
  );
};

// ============================================================================
// 2. TİPOGRAFİ BİLEŞENİ
// ============================================================================
const TypographyGroup = ({ styles }: { styles: any }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.title}>Yeni Bir Başlangıç Yapın</Text>
      <Text style={styles.subtitle}>
        Henüz hesaplanmış kaza namazınız bulunmuyor. Hemen hesaplayarak
        başlayın.
      </Text>
    </View>
  );
};

// ============================================================================
// 3. AKSİYON BİLEŞENİ
// ============================================================================
interface ActionButtonsProps {
  styles: any;
  onPressCalculate?: () => void;
  onPressGuide?: () => void;
}

const ActionButtons = ({
  styles,
  onPressCalculate,
  onPressGuide,
}: ActionButtonsProps) => {
  return (
    <View style={styles.actionContainer}>
      <Pressable style={styles.primaryButton} onPress={onPressCalculate}>
        <MaterialIcons
          name="add-task"
          size={24}
          color={styles._colors.onPrimary}
        />
        <Text style={styles.primaryButtonText}>Kaza Namazlarımı Hesapla</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onPressGuide}>
        <Text style={styles.secondaryButtonText}>
          Nasıl çalışır? Rehberi görüntüle
        </Text>
        <MaterialIcons
          name="arrow-outward"
          size={18}
          color={styles._colors.secondary}
        />
      </Pressable>
    </View>
  );
};

// ============================================================================
// ANA BİLEŞEN (Empty State)
// ============================================================================
interface EmptyStateProps {
  onPressCalculate?: () => void;
  onPressGuide?: () => void;
}

export function EmptyState({
  onPressCalculate,
  onPressGuide,
}: EmptyStateProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <SpiritualIllustration styles={styles} />
      <TypographyGroup styles={styles} />
      <ActionButtons
        styles={styles}
        onPressCalculate={onPressCalculate}
        onPressGuide={onPressGuide}
      />
    </View>
  );
}

// ============================================================================
// STİLLER
// ============================================================================
const useStyles = makeStyles((C) => ({
  _colors: C as any,
  container: {
    flex: 1,
    backgroundColor: C.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },

  // --- Illustration Styles ---
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 48,
  },
  glowBackground: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: C.primary,
    opacity: 0.05,
  },
  centerBox: {
    width: 150,
    height: 150,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "3deg" }],
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  centerIcon: {
    transform: [{ rotate: "-3deg" }],
  },
  floatingBadge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  topRightBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.secondaryContainer,
    top: -10,
    right: -10,
  },
  bottomLeftBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.surfaceContainerLowest,
    bottom: -15,
    left: -20,
  },

  // --- Typography Styles ---
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: C.onSurface,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: C.onSurfaceVariant,
    textAlign: "center",
    maxWidth: "90%",
  },

  // --- Action Buttons Styles ---
  actionContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  primaryButtonText: {
    color: C.onPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 4,
  },
  secondaryButtonText: {
    color: C.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
}));
