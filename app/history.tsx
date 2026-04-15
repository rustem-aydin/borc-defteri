import { Header } from "@/components/Header";
import { HistoryList } from "@/components/screens/history/HistoryList";
import { makeStyles } from "@/hooks/make-styles";
import { useHistoryQuery } from "@/hooks/useHistoryQuery";
import { i18n } from "@/lib/i18n";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const styles = useStyles();
  const { data, isLoading } = useHistoryQuery();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Tabs.Screen options={{ headerShown: false }} />
      <Header title={i18n.t("gecmis")} />
      <View style={{ flex: 1 }}>
        <HistoryList
          sections={data?.sections ?? []}
          weeklyCount={data?.weeklyCount ?? 0}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  container: {
    flex: 1,
    backgroundColor: C.surface,
  },
}));
