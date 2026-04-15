import { makeStyles } from "@/hooks/make-styles";
import React from "react";
import { Text, View } from "react-native";
import { ActivityItem, HistoryLog } from "./ActivityItem";

export interface GroupedLog {
  title: string;
  subtitle: string;
  data: HistoryLog[];
}

export function SectionGroup({ item }: { item: GroupedLog }) {
  const styles = useStyles();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionSubtitle}>
            {item.subtitle || "GEÇMİŞ"}
          </Text>
          <Text style={styles.sectionTitle}>{item.title}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {item.data.map((log) => (
          <ActivityItem key={log.id} item={log} />
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { marginBottom: 12, paddingHorizontal: 4 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.onSurface,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
}));
