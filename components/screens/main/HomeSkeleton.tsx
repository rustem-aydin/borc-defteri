// components/screens/main/HomeSkeleton.tsx
import { makeStyles } from "@/hooks/make-styles";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, View } from "react-native";

function SkeletonItem({ style }: { style: any }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[style, { opacity }]} />;
}

export function HomeSkeleton() {
  const styles = useStyles();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* WeekNavigator Skeleton */}
      <View style={styles.card}>
        <View style={styles.dateRow}>
          <SkeletonItem style={styles.skeletonIcon} />
          <View style={{ alignItems: "center", gap: 8 }}>
            <SkeletonItem style={styles.skeletonDate} />
            <SkeletonItem style={styles.skeletonSubtitle} />
          </View>
          <SkeletonItem style={styles.skeletonIcon} />
        </View>
        <View style={styles.progressContainer}>
          <SkeletonItem style={styles.skeletonProgress} />
        </View>
      </View>

      {/* StackedBarChart Skeleton */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <SkeletonItem style={styles.skeletonChartTitle} />
        </View>
        <View style={styles.chartBars}>
          {[...Array(7)].map((_, i) => (
            <SkeletonItem key={i} style={styles.skeletonBar} />
          ))}
        </View>
      </View>

      {/* LastPrayer Skeleton */}
      <View style={styles.card}>
        <View style={styles.lastPrayerRow}>
          <SkeletonItem style={styles.skeletonAvatar} />
          <View style={{ flex: 1, gap: 6 }}>
            <SkeletonItem style={styles.skeletonText} />
            <SkeletonItem style={styles.skeletonTextSmall} />
          </View>
          <SkeletonItem style={styles.skeletonBadge} />
        </View>
      </View>

      {/* PrayerSection Skeleton */}
      <View style={styles.prayerGrid}>
        {[...Array(6)].map((_, i) => (
          <SkeletonItem key={i} style={styles.skeletonPrayerCard} />
        ))}
      </View>
    </ScrollView>
  );
}

const useStyles = makeStyles((C) => ({
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressContainer: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonDate: {
    width: 140,
    height: 22,
    borderRadius: 6,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonSubtitle: {
    width: 100,
    height: 14,
    borderRadius: 4,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonProgress: {
    height: 6,
    borderRadius: 10,
    width: "100%",
    backgroundColor: C.surfaceContainerHigh,
  },
  // Chart skeleton
  chartCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    marginBottom: 8,
  },
  chartHeader: {
    marginBottom: 16,
  },
  skeletonChartTitle: {
    width: 120,
    height: 16,
    borderRadius: 4,
    backgroundColor: C.surfaceContainerHigh,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    gap: 8,
  },
  skeletonBar: {
    flex: 1,
    height: "70%",
    borderRadius: 6,
    backgroundColor: C.surfaceContainerHigh,
  },
  // LastPrayer skeleton
  lastPrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonText: {
    width: "60%",
    height: 16,
    borderRadius: 4,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonTextSmall: {
    width: "40%",
    height: 12,
    borderRadius: 3,
    backgroundColor: C.surfaceContainerHigh,
  },
  skeletonBadge: {
    width: 60,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.surfaceContainerHigh,
  },
  // Prayer grid skeleton
  prayerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },
  skeletonPrayerCard: {
    width: "47%",
    height: 140,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerHigh,
  },
}));
