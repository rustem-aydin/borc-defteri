// components/screens/main/PrayerSection.tsx
import { PrayerGrid } from "@/components/screens/main/PrayerGrid";
import React, { memo } from "react";
import { View } from "react-native";

function PrayerSection() {
  return (
    <View>
      <PrayerGrid />
    </View>
  );
}

export default memo(PrayerSection);
