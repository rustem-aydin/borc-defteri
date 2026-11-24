// components/screens/main/HomeContent.tsx
import LastPrayer from "@/components/screens/main/LastPrayer";
import { makeStyles } from "@/hooks/make-styles";
import React, { memo, useCallback, useState } from "react";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
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

/** Ekran yüksekliğine sığmayan cihazlarda içerik bu kadar px taşarsa kaydırma açılır. */
const SCROLL_TOLERANCE = 2;

function HomeContent({ weekData, onPrevWeek, onNextWeek }: HomeContentProps) {
  const styles = useStyles();

  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) setViewportHeight(height);
  }, []);

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) setContentHeight(height);
  }, []);

  // İçerik ekrana sığıyorsa ScrollView hiç render edilmez: kayacak yüzey olmaz.
  const needsScroll =
    viewportHeight > 0 &&
    contentHeight > 0 &&
    contentHeight > viewportHeight + SCROLL_TOLERANCE;

  const content = (
    <>
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
    </>
  );

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {needsScroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          removeClippedSubviews={true}
          // iOS'ta momentum kaydırma performansı için
          decelerationRate="normal"
        >
          <View onLayout={handleContentLayout}>{content}</View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <View onLayout={handleContentLayout}>{content}</View>
        </View>
      )}
    </View>
  );
}

// Sadece props değişirse render olsun
export default memo(HomeContent);

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
}));
