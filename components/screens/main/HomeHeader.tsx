import Logo from "@/components/Logo";
import { AppButton } from "@/components/ui/prressable";
import { makeStyles } from "@/hooks/make-styles";
import { historyQueryOptions } from "@/hooks/useHistoryQuery";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function HomeHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const db = useSQLiteContext();
  const styles = useStyles();
  const { colors: C } = useTheme();

  const prefetchHistory = () => {
    queryClient.prefetchQuery(historyQueryOptions(db));
    router.navigate("/history");
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Logo />
      <View style={{ flexDirection: "row", gap: 4 }}>
        <AppButton
          variant="icon-button"
          onPress={() => router.navigate("/info")}
        >
          <MaterialIcons name="info-outline" size={24} color={C.primary} />
        </AppButton>
        <AppButton variant="icon-button" onPress={prefetchHistory}>
          <MaterialIcons name="history" size={24} color={C.primary} />
        </AppButton>
        <AppButton
          variant="icon-button"
          onPress={() => router.navigate("/settings")}
        >
          <MaterialIcons name="settings" size={24} color={C.primary} />
        </AppButton>
      </View>
    </View>
  );
}

const useStyles = makeStyles((C) => ({
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: C.surface,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
}));
