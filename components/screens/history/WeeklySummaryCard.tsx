import { makeStyles } from "@/hooks/make-styles";
import { Text, View } from "react-native";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

interface WeeklySummaryCardProps {
  weeklyCount: number;
  todayDayIdx: number;
}

export function WeeklySummaryCard({
  weeklyCount,
  todayDayIdx,
}: WeeklySummaryCardProps) {
  const styles = useStyles();

  return (
    <View>
      <View style={styles.bentoCard}>
        <Text style={styles.bentoTitle}>Haftalık Özet</Text>
        <Text style={styles.bentoSubtitle}>
          Geriye dönük son 7 günde {weeklyCount} vakit kaza kılındı.
        </Text>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: (weeklyCount > 0
                  ? `${Math.min((weeklyCount / 40) * 100, 100)}%`
                  : "0%") as `${number}%`,
              },
            ]}
          />
        </View>

        <View style={styles.daysRow}>
          {DAY_LABELS.map((day, i) => (
            <Text
              key={i}
              style={[
                styles.dayText,
                i === todayDayIdx && styles.dayTextActive,
              ]}
            >
              {day}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  bentoCard: {
    backgroundColor: C.primary,
    borderRadius: 32,
    padding: 24,
    overflow: "hidden",
    marginTop: 16,
  },
  bentoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.onPrimary,
    marginBottom: 4,
  },
  bentoSubtitle: {
    fontSize: 14,
    color: C.primaryFixed,
    marginBottom: 16,
  },
  progressBg: {
    height: 4,
    backgroundColor: "rgba(148, 226, 224, 0.3)",
    borderRadius: 10,
    width: "100%",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.primaryFixed,
    borderRadius: 10,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.onPrimaryFixedVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dayTextActive: {
    color: C.primaryFixed,
  },
}));
