// components/screens/main/HomeContent.tsx
import LastPrayer from "@/components/screens/main/LastPrayer";
import { makeStyles } from "@/hooks/make-styles";
import React, { memo } from "react";
import { ScrollView, View } from "react-native";
import PrayerSection from "./PrayerSection";
import WeeklySection from "./WeeklySection";

interface HomeContentProps {
  weekData: {
    startOfWeek: Date;
    endOfWeek: Date;
    isCurrentWeek: boolean;
    todayDayIdx: number;
    dateRangeStr: string;
  };
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

function HomeContent({ weekData, onPrevWeek, onNextWeek }: HomeContentProps) {
  const styles = useStyles();

  return (
    <View style={[styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        // iOS'ta momentum kaydırma performansı için
        decelerationRate="normal"
      >
        <WeeklySection
          startOfWeek={weekData.startOfWeek}
          endOfWeek={weekData.endOfWeek}
          dateRangeStr={weekData.dateRangeStr}
          isCurrentWeek={weekData.isCurrentWeek}
          todayDayIdx={weekData.todayDayIdx}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />

        <LastPrayer />

        <PrayerSection />
      </ScrollView>
    </View>
  );
}

// Sadece props değişirse render olsun
export default memo(HomeContent);

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
}));
