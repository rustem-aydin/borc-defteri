import { useWeeklyHistoryQuery } from "@/hooks/useWeeklyHistoryQuery";
import { LayoutChangeEvent, View } from "react-native";
import { StackedBarChart } from "./StackedBarChart";
import { WeekNavigator } from "./WeekNavigator";

interface Props {
  startOfWeek: Date;
  endOfWeek: Date;
  dateRangeStr: string;
  isCurrentWeek: boolean;
  todayDayIdx: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  /** Grafik yüksekliği; ekrana sığdırmak için üstten verilir. */
  chartHeight?: number;
  /** Hafta gezinme kartının ölçülen yüksekliği (dp). */
  onNavigatorHeight?: (height: number) => void;
}

export function WeeklyChart({
  startOfWeek,
  endOfWeek,
  dateRangeStr,
  isCurrentWeek,
  todayDayIdx,
  onPrevWeek,
  onNextWeek,
  chartHeight,
  onNavigatorHeight,
}: Props) {
  const { data } = useWeeklyHistoryQuery(startOfWeek, endOfWeek);

  const handleNavigatorLayout = (event: LayoutChangeEvent) => {
    if (!onNavigatorHeight) return;
    const { height } = event.nativeEvent.layout;
    if (height > 0) onNavigatorHeight(height);
  };

  return (
    <>
      <View onLayout={handleNavigatorLayout}>
        <WeekNavigator
          dateRangeStr={dateRangeStr}
          weeklyTotal={data?.weeklyTotal ?? 0}
          isCurrentWeek={isCurrentWeek}
          todayDayIdx={todayDayIdx}
          onPrevWeek={onPrevWeek}
          onNextWeek={onNextWeek}
        />
      </View>
      <StackedBarChart data={data?.chartData ?? []} height={chartHeight} />
    </>
  );
}
