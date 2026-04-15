// components/screens/main/HomeScreen.tsx
import { EmptyState } from "@/components/screens/main/EmptyState";
import HomeContent from "@/components/screens/main/HomeContent";
import { HomeHeader } from "@/components/screens/main/HomeHeader";
import { makeStyles } from "@/hooks/make-styles";
import { usePrayersQuery } from "@/hooks/usePrayersQuery";
import { useTheme } from "@/lib/ThemeContext";
import { formatDateRange, getEndOfWeek, getStartOfWeek } from "@/lib/utils";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const styles = useStyles();
  const { isDark } = useTheme();
  const { data, isLoading } = usePrayersQuery();
  const totalDebt = data?.totalDebt ?? 0;

  const [viewDate, setViewDate] = useState(new Date());

  // Tarih hesaplamaları useMemo ile stabilize edildi
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

  // Callback'ler useCallback ile stabilize edildi (Child props değişimini önler)
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
        <View style={styles.loadingContainer} />
      ) : totalDebt === 0 ? (
        <EmptyState onPressCalculate={handleCalculatePress} />
      ) : (
        <HomeContent
          weekData={weekData}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    backgroundColor: C.surface,
  },
  loadingContainer: {
    flex: 1,
    // İsteğe bağlı: Basit bir loading göstergesi koyulabilir
  },
}));
