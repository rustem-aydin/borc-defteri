import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, Text, TouchableOpacity, View } from "react-native";

interface WeekNavigatorProps {
  dateRangeStr: string;
  weeklyTotal: number | string;
  isCurrentWeek: boolean;
  todayDayIdx: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function WeekNavigator({
  dateRangeStr,
  weeklyTotal,
  onPrevWeek,
  onNextWeek,
}: WeekNavigatorProps) {
  const styles = useStyles();
  const { colors: C } = useTheme();
  const [weeklyTarget, setWeeklyTarget] = useState<number>(35);

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const storedWeekly = await AsyncStorage.getItem("@target_weekly");
        if (storedWeekly) {
          setWeeklyTarget(Number(storedWeekly));
        }
      } catch (error) {
        console.log("Hedef çekilemedi:", error);
      }
    };

    fetchTarget();

    const subscription = DeviceEventEmitter.addListener("TargetUpdated", () => {
      fetchTarget();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const safeTotal = Number(weeklyTotal) || 0;
  const isTargetReached = safeTotal >= weeklyTarget;
  const progressPercent = Math.round(
    Math.min((safeTotal / weeklyTarget) * 100, 100),
  );

  return (
    <View style={styles.card}>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.iconBtnSmall} onPress={onPrevWeek}>
          <MaterialIcons name="chevron-left" size={28} color={C.primary} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.dateText}>{dateRangeStr}</Text>
          <Text style={styles.dateSubtitle}>
            {i18n.t("home.weekNav")[0]}{" "}
            <Text
              style={isTargetReached ? styles.textSuccess : styles.textNormal}
            >
              {safeTotal}
            </Text>
            / {weeklyTarget} {i18n.t("home.weekNav")[1]}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconBtnSmall} onPress={onNextWeek}>
          <MaterialIcons name="chevron-right" size={28} color={C.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: isTargetReached ? C.tertiary : C.primary,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: C.onSurfaceVariant,
  },
  dateSubtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: C.secondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  textNormal: {
    color: C.secondary,
  },
  textSuccess: {
    color: C.tertiary,
    fontSize: 12,
  },
  iconBtnSmall: {
    padding: 4,
  },
  progressContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: C.surfaceContainer,
    borderRadius: 10,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
}));
