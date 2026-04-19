// components/screens/main/HomeScreen.tsx
import { EmptyState } from "@/components/screens/main/EmptyState";
import HomeContent from "@/components/screens/main/HomeContent";
import { HomeHeader } from "@/components/screens/main/HomeHeader";
import { HomeSkeleton } from "@/components/screens/main/HomeSkeleton";
import { makeStyles } from "@/hooks/make-styles";
import { usePrayersQuery } from "@/hooks/usePrayersQuery";
import { useTheme } from "@/lib/ThemeContext";
import { formatDateRange, getEndOfWeek, getStartOfWeek } from "@/lib/utils";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DeviceEventEmitter, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const styles = useStyles();
  const { isDark } = useTheme();
  const { data, isLoading, refetch } = usePrayersQuery();
  const totalDebt = data?.totalDebt ?? 0;

  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "PrayersUpdated",
      () => {
        refetch();
      },
    );
    return () => subscription.remove();
  }, [refetch]);

  const weekData = useMemo(() => {
    const startOfWeek = getStartOfWeek(viewDate);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = getEndOfWeek(startOfWeek);
    endOfWeek.setHours(23, 59, 59, 999);

    const now = new Date();
    const isCurrentWeek = now >= startOfWeek && now <= endOfWeek;
    const todayDayIdx = now.getDay() - 1 === -1 ? 6 : now.getDay() - 1;

    return {
      startOfWeek,
      endOfWeek,
      isCurrentWeek,
      todayDayIdx,
      dateRangeStr: formatDateRange(startOfWeek, endOfWeek),
    };
  }, [viewDate]);

  const handlePrevWeek = useCallback(() => {
    setViewDate((d) => new Date(d.setDate(d.getDate() - 7)));
  }, []);

  const handleNextWeek = useCallback(() => {
    setViewDate((d) => new Date(d.setDate(d.getDate() + 7)));
  }, []);

  const handleCalculatePress = useCallback(() => {
    router.push("/calculate");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent={false}
      />
      <HomeHeader />

      {isLoading ? (
        <HomeSkeleton />
      ) : totalDebt === 0 ? (
        <EmptyState onPressCalculate={handleCalculatePress} />
      ) : (
        <HomeContent
          weekData={weekData}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      )}
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    backgroundColor: C.surface,
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
}));
