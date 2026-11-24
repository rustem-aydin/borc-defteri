// components/screens/main/WeeklySection.tsx
import { WeeklyChart } from "@/components/screens/main/WeeklyChart";
import React, { memo } from "react";
import { View } from "react-native";

interface WeeklySectionProps {
  startOfWeek: Date;
  endOfWeek: Date;
  dateRangeStr: string;
  isCurrentWeek: boolean;
  todayDayIdx: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

function WeeklySection(props: WeeklySectionProps) {
  return (
    <View>
      <WeeklyChart {...props} />
    </View>
  );
}

export default memo(WeeklySection);
