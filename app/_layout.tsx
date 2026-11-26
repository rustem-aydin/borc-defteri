import { ToastProvider } from "@/components/ui/toast";
import { useEffect } from "react";
import "@/lib/i18n";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext"; // useTheme EKLENDİ
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { migrateDbIfNeeded } from "../lib/db";
import { reconcileDailyReminder } from "@/lib/notifications";
const queryClient = new QueryClient({
  defaultOptions: {
    // Veri yerel SQLite'ta; gereksiz yeniden okumaları önlemek için kısa
    // staleTime yeterli, yazma yolları invalidate ile tazeliyor.
    queries: { staleTime: 30_000, gcTime: 5 * 60_000 },
  },
});

export const unstable_settings = {
  anchor: "index",
};
// Splash'ın tek sahibi burasıdır: gizleme app/index.tsx hazır olduğunda yapılır.
SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { isDark, colors } = useTheme();

  // Ayar açıksa ve zamanlanmış bildirim kaybolmuşsa açılışta yeniden kurar.
  useEffect(() => {
    void reconcileDailyReminder();
  }, []);

  const screenBackgroundColor =
    colors?.surface || (isDark ? "#000000" : "#FFFFFF");

  return (
    <View style={{ flex: 1, backgroundColor: screenBackgroundColor }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="mezhep" />
        <Stack.Screen name="pin/setup" />
        <Stack.Screen name="pin/unlock" />

        <Stack.Screen
          name="history"
          options={{
            presentation: "modal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: "modal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen
          name="calculate/index"
          options={({ route }) => {
            // Onboarding akışında mezhep ekranı calculate ile değiştirilir; o
            // anda calculate yığının tek ekranı olur ve modal bir ekranın
            // altında taban ekran bulunamaz. Bu durumda kart olarak açılır
            // (zaten native stack de öyle render ediyor). Diğer girişlerde
            // (home, settings) modal olarak açılmaya devam eder.
            const from = (route.params as { from?: string } | undefined)?.from;
            return {
              presentation: from === "onboarding" ? "card" : "modal",
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" },
            };
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SQLiteProvider
              databaseName="kaza_borc_defteri.db"
              onInit={migrateDbIfNeeded}
              useSuspense
            >
              <ToastProvider>
                <ThemedStack />
              </ToastProvider>
            </SQLiteProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
