import { useWeeklyHistoryQuery } from "@/hooks/useWeeklyHistoryQuery";
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
}

export function WeeklyChart({
  startOfWeek,
  endOfWeek,
  dateRangeStr,
  isCurrentWeek,
  todayDayIdx,
  onPrevWeek,
  onNextWeek,
}: Props) {
  const { data } = useWeeklyHistoryQuery(startOfWeek, endOfWeek);

  return (
    <>
      <WeekNavigator
        dateRangeStr={dateRangeStr}
        weeklyTotal={data?.weeklyTotal ?? 0}
        isCurrentWeek={isCurrentWeek}
        todayDayIdx={todayDayIdx}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
      />
      <StackedBarChart data={data?.chartData ?? []} />
    </>
  );
}
