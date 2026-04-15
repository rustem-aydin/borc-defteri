import React from 'react';
import { View, Text } from 'react-native';

export interface SectionHeaderProps {
  date: string;
  label: string;
}

export default function SectionHeader({ date, label }: SectionHeaderProps) {
  return (
    <View className="flex-row items-baseline justify-between mb-4 px-2 mt-6">
      <Text className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
        {date}
      </Text>
      <Text className="font-label text-xs font-semibold uppercase tracking-widest text-outline">
        {label}
      </Text>
    </View>
  );
}