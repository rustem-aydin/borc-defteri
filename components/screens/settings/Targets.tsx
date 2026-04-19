import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, Pressable, Text, View } from "react-native";

const DAILY_KEY = "@target_daily";
const WEEKLY_KEY = "@target_weekly";

function GoalRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  onDecrease,
  onIncrease,
  borderTop,
  decreaseDisabled,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  borderTop?: boolean;
  decreaseDisabled?: boolean;
}) {
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  return (
    <View style={[rowStyles.container, borderTop && rowStyles.borderTop]}>
      <View style={rowStyles.left}>
        <View style={[rowStyles.iconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={rowStyles.textWrap}>
          <Text style={rowStyles.title}>{title}</Text>
          <Text style={rowStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={rowStyles.counterContainer}>
        <Pressable
          onPress={onDecrease}
          disabled={decreaseDisabled}
          style={({ pressed }) => [
            rowStyles.actionBtn,
            pressed && rowStyles.actionBtnPressed,
            decreaseDisabled && rowStyles.actionBtnDisabled,
          ]}
        >
          <MaterialIcons
            name="remove"
            size={20}
            color={
              decreaseDisabled ? C.onSurfaceVariant : C.onSecondaryContainer
            }
          />
        </Pressable>
        <Text style={rowStyles.counterValue}>{value}</Text>
        <Pressable
          onPress={onIncrease}
          style={({ pressed }) => [
            rowStyles.actionBtn,
            pressed && rowStyles.actionBtnPressed,
          ]}
        >
          <MaterialIcons name="add" size={20} color={C.onSecondaryContainer} />
        </Pressable>
      </View>
    </View>
  );
}

export function TargetSection() {
  const styles = useStyles();
  const { colors: C } = useTheme();

  const [dailyTarget, setDailyTarget] = useState<number>(5);
  const [weeklyTarget, setWeeklyTarget] = useState<number>(35);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const storedDaily = await AsyncStorage.getItem(DAILY_KEY);
        const storedWeekly = await AsyncStorage.getItem(WEEKLY_KEY);
        if (storedDaily) setDailyTarget(parseInt(storedDaily, 10));
        if (storedWeekly) setWeeklyTarget(parseInt(storedWeekly, 10));
      } catch (error) {
        console.error("Hedefler yüklenirken hata oluştu:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTargets();
  }, []);

  const handleDailyChange = async (amount: number) => {
    const newDaily = Math.max(1, dailyTarget + amount);
    const diff = newDaily - dailyTarget;
    if (diff === 0) return;

    const newWeekly = Math.max(newDaily * 7, weeklyTarget + diff * 7);
    setDailyTarget(newDaily);
    setWeeklyTarget(newWeekly);

    try {
      await AsyncStorage.multiSet([
        ["@target_daily", newDaily.toString()],
        ["@target_weekly", newWeekly.toString()],
      ]);
      DeviceEventEmitter.emit("TargetUpdated");
    } catch (error) {
      console.error(error);
    }
  };

  const handleWeeklyChange = async (amount: number) => {
    const minWeekly = dailyTarget * 7;
    const newWeekly = Math.max(minWeekly, weeklyTarget + amount);
    if (newWeekly === weeklyTarget) return;

    setWeeklyTarget(newWeekly);

    try {
      await AsyncStorage.setItem("@target_weekly", newWeekly.toString());
      DeviceEventEmitter.emit("TargetUpdated");
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="flag" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>{i18n.t(`goals.title`)}</Text>
      </View>
      <View style={styles.card}>
        <GoalRow
          icon="today"
          iconBg={C.primaryContainer}
          iconColor={C.onPrimaryContainer}
          title={i18n.t(`goals.dailyGoal`)}
          subtitle={i18n.t(`goals.dailyGoalHint`)}
          value={dailyTarget}
          onDecrease={() => handleDailyChange(-1)}
          onIncrease={() => handleDailyChange(1)}
        />
        <GoalRow
          icon="date-range"
          iconBg={C.secondaryContainer}
          iconColor={C.onSecondaryContainer}
          title={i18n.t(`goals.weeklyGoal`)}
          subtitle={i18n.t(`goals.weeklyGoalHint`)}
          value={weeklyTarget}
          onDecrease={() => handleWeeklyChange(-1)}
          onIncrease={() => handleWeeklyChange(1)}
          borderTop
          decreaseDisabled={weeklyTarget <= dailyTarget * 7}
        />
      </View>
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
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + "26",
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
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPressed: {
    backgroundColor: C.secondaryContainer + "70",
  },
  actionBtnDisabled: {
    backgroundColor: C.surfaceContainerHighest,
  },
  counterValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: C.onSurface,
    width: 44,
    textAlign: "center",
  },
}));

const useStyles = makeStyles((C) => ({
  container: {
    marginBottom: 24,
  },
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
}));
