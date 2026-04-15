import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, Pressable, Text, View } from "react-native";

const DAILY_KEY = "@target_daily";
const WEEKLY_KEY = "@target_weekly";

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
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="today" size={24} color={C.primary} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.cardTitle}>{i18n.t(`goals.dailyGoal`)}</Text>
            <Text style={styles.cardHint}>{i18n.t(`goals.dailyGoalHint`)}</Text>
          </View>
        </View>

        <View style={styles.counterContainer}>
          <Pressable
            onPress={() => handleDailyChange(-1)}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
          >
            <MaterialIcons name="remove" size={20} color={C.primary} />
          </Pressable>
          <Text style={styles.counterValue}>{dailyTarget}</Text>
          <Pressable
            onPress={() => handleDailyChange(1)}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
          >
            <MaterialIcons name="add" size={20} color={C.primary} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.card, { marginTop: 10 }]}>
        <View style={styles.cardLeft}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="date-range" size={24} color={C.primary} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.cardTitle}>{i18n.t(`goals.weeklyGoal`)}</Text>
            <Text style={styles.cardHint}>
              {i18n.t(`goals.weeklyGoalHint`)}
            </Text>
          </View>
        </View>

        <View style={styles.counterContainer}>
          <Pressable
            onPress={() => handleWeeklyChange(-1)}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
              weeklyTarget <= dailyTarget * 7 && styles.actionBtnDisabled,
            ]}
          >
            <MaterialIcons
              name="remove"
              size={20}
              color={
                weeklyTarget <= dailyTarget * 7 ? C.onSurfaceVariant : C.primary
              }
            />
          </Pressable>
          <Text style={styles.counterValue}>{weeklyTarget}</Text>
          <Pressable
            onPress={() => handleWeeklyChange(1)}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
          >
            <MaterialIcons name="add" size={20} color={C.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primaryFixed + "40",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: C.onSurface,
    marginBottom: 2,
  },
  cardHint: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: C.onSurfaceVariant,
    lineHeight: 16,
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
    backgroundColor: C.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPressed: {
    backgroundColor: C.primaryFixed + "70",
  },
  actionBtnDisabled: {
    backgroundColor: C.surfaceContainerHigh,
  },
  counterValue: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: C.onSurface,
    width: 44,
    textAlign: "center",
  },
}));
