import { makeStyles } from "@/hooks/make-styles";
import { GroupedLog } from "@/hooks/useHistoryQuery";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { EmptyHistory } from "./EmptyHistory";
import { SectionGroup } from "./SectionGroup";

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
  weeklyCount,
  isLoading,
}: {
  sections: GroupedLog[];
  weeklyCount: number;
  isLoading?: boolean;
}) {
  const styles = useStyles();

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
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <SectionGroup item={item} />}
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
