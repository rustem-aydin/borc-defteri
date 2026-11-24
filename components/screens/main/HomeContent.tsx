// components/screens/main/HomeContent.tsx
import LastPrayer from "@/components/screens/main/LastPrayer";
import { makeStyles } from "@/hooks/make-styles";
import React, { memo, useCallback, useMemo, useState } from "react";
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

/** Grafik yüksekliği sınırları (dp). Ekran yüksekliğine göre ölçeklenir. */
const CHART_MAX_HEIGHT = 280;
const CHART_MIN_HEIGHT = 140;
/** Grafik kartının alt boşluğu (StackedBarChart styles.card.marginBottom). */
const CHART_MARGIN_BOTTOM = 18;
/** İçeriğin üst/alt boşluğu (dp); ölçümde bu kadar yer ayrılır. */
const CONTENT_PADDING_TOP = 60;
const CONTENT_PADDING_BOTTOM = 40;

function HomeContent({ weekData, onPrevWeek, onNextWeek }: HomeContentProps) {
  const styles = useStyles();

  const [viewportHeight, setViewportHeight] = useState(0);
  const [navigatorHeight, setNavigatorHeight] = useState(0);
  const [bottomHeight, setBottomHeight] = useState(0);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) setViewportHeight(height);
  }, []);

  const handleBottomLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) setBottomHeight(height);
  }, []);

  /** Grafik dışındaki her şey ölçüldükten sonra grafiğe kalan alan. */
  const chartSpace = useMemo(() => {
    if (!viewportHeight || !navigatorHeight || !bottomHeight) {
      return CHART_MAX_HEIGHT;
    }
    return (
      viewportHeight -
      CONTENT_PADDING_TOP -
      CONTENT_PADDING_BOTTOM -
      navigatorHeight -
      bottomHeight -
      CHART_MARGIN_BOTTOM
    );
  }, [viewportHeight, navigatorHeight, bottomHeight]);

  const chartHeight = Math.max(
    CHART_MIN_HEIGHT,
    Math.min(CHART_MAX_HEIGHT, chartSpace),
  );
  // Grafik en küçük boyutta bile sığmıyorsa (çok kısa ekran) kaydırma devreye girer.
  const needsScroll = chartSpace < CHART_MIN_HEIGHT;

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
        chartHeight={chartHeight}
        onNavigatorHeight={setNavigatorHeight}
      />

      <View onLayout={handleBottomLayout}>
        <LastPrayer />
        <PrayerSection />
      </View>
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
          {content}
        </ScrollView>
      ) : (
        <View style={styles.content}>{content}</View>
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
    paddingTop: CONTENT_PADDING_TOP,
    paddingHorizontal: 24,
    paddingBottom: CONTENT_PADDING_BOTTOM,
  },
}));
