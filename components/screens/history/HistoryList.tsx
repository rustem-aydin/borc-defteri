import { makeStyles } from "@/hooks/make-styles";
import type { GroupedLog } from "@/hooks/useHistoryQuery";
import { flattenHistorySections } from "@/lib/historySections";
import { i18n } from "@/lib/i18n";
import { FlashList } from "@shopify/flash-list";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { ActivityItem } from "./ActivityItem";
import { EmptyHistory } from "./EmptyHistory";

const SkeletonRow = () => {
  const styles = useStyles();
  return <View style={styles.skeletonRow} />;
};

const SkeletonHeader = () => {
  const styles = useStyles();
  return <View style={styles.skeletonHeader} />;
};

function SkeletonList() {
  const styles = useStyles();
  return (
    <View style={styles.skeletonContainer}>
      {[...Array(3)].map((_, groupIdx) => (
        <View key={groupIdx}>
          <SkeletonHeader />
          {[...Array(groupIdx === 0 ? 3 : 2)].map((_, rowIdx) => (
            <SkeletonRow key={rowIdx} />
          ))}
        </View>
      ))}
    </View>
  );
}

export function HistoryList({
  sections,
  isLoading,
}: {
  sections: GroupedLog[];
  isLoading?: boolean;
}) {
  const styles = useStyles();
  const items = useMemo(() => flattenHistorySections(sections), [sections]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View
          style={[
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
            { zIndex: 1 },
          ]}
        >
          <SkeletonList />
        </View>
      )}

      <FlashList
        data={items}
        keyExtractor={(item) => item.key}
        getItemType={(item) => item.type}
        renderItem={({ item }) =>
          item.type === "header" ? (
            <View
              style={[
                styles.sectionHeader,
                item.isFirst && styles.sectionHeaderFirst,
              ]}
            >
              <Text style={styles.sectionSubtitle}>
                {item.subtitle || i18n.t("history.sectionFallback")}
              </Text>
              <Text style={styles.sectionTitle}>{item.title}</Text>
            </View>
          ) : (
            <ActivityItem
              item={item.log}
              isFirst={item.isFirst}
              isLast={item.isLast}
            />
          )
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? <EmptyHistory /> : null}
      />
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  content: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionHeaderFirst: {
    marginTop: 0,
  },
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
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skeletonHeader: {
    height: 18,
    width: 120,
    borderRadius: 6,
    backgroundColor: C.secondaryContainer,
    marginTop: 20,
    marginBottom: 10,
    opacity: 0.7,
  },
  skeletonRow: {
    height: 56,
    borderRadius: 12,
    backgroundColor: C.surfaceContainerHigh,
    marginVertical: 4,
    opacity: 0.5,
  },
}));
