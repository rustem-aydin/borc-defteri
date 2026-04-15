import { AppButton } from "@/components/ui/prressable";
import { useToast } from "@/components/ui/toast";
import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text, Vibration, View } from "react-native";

interface PrayerCardProps {
  vakit_id: string;
  kalan_sayi: number;
  title: string;
  color: string;
  image: any;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function PrayerCard({
  kalan_sayi,
  title,
  color,
  image,
  onDecrement,
  onIncrement,
}: PrayerCardProps) {
  const styles = useStyles();
  const { colors: C } = useTheme();
  const { toast } = useToast();

  const handleDecrement = () => {
    Vibration.vibrate(50);
    onDecrement();
  };

  const handleIncrement = () => {
    onIncrement();
    toast({
      title: i18n.t("prayerCard.toast.title"),
      description: i18n.t("prayerCard.toast.description"),
      variant: "error",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.vakitHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
          <Image source={image} style={styles.vakitIcon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.vakitTitle}>{title}</Text>
          <Text style={styles.vakitCount}>
            {kalan_sayi.toLocaleString("tr-TR")} {i18n.t("diger.vakit")}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <AppButton variant="remove" onPress={handleDecrement}>
          <MaterialIcons name="remove" size={20} color={C.onPrimary} />
        </AppButton>
        <AppButton variant="add" onPress={handleIncrement}>
          <MaterialIcons name="add" size={20} color={C.onSecondaryContainer} />
        </AppButton>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: "48%",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  vakitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  vakitIcon: {
    backgroundColor: C.surfaceContainerLowest,
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
  vakitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.onSurface,
  },
  vakitCount: {
    fontSize: 11,
    fontWeight: "500",
    color: C.secondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
}));
