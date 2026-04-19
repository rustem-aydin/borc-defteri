import { Header } from "@/components/Header";
import { HistoryList } from "@/components/screens/history/HistoryList";
import { makeStyles } from "@/hooks/make-styles";
import { useHistoryQuery } from "@/hooks/useHistoryQuery";
import { i18n } from "@/lib/i18n";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const styles = useStyles();
  const { data, isLoading } = useHistoryQuery();

  return (
    <SafeAreaView style={[styles.container]}>
      <Header title={i18n.t("gecmis")} />
      <View style={{ flex: 1 }}>
        <HistoryList
          sections={data?.sections ?? []}
          weeklyCount={data?.weeklyCount ?? 0}
          isLoading={isLoading}
        />
      </View>
      <View style={styles.blobTopRight} pointerEvents="none" />
      <View style={styles.blobBottomLeft} pointerEvents="none" />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    backgroundColor: C.surface,
  },
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(162,240,238,0.12)",
    zIndex: -1,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(205,232,231,0.12)",
    zIndex: -1,
  },
}));
