import { ToastProvider } from "@/components/ui/toast";
import "@/lib/i18n";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext"; // useTheme EKLENDİ
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { migrateDbIfNeeded } from "../lib/db";

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "index",
};
SplashScreen.hideAsync();

function ThemedStack() {
  const { isDark, colors } = useTheme();

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
        <Stack.Screen name="home" />
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
          options={{
            presentation: "modal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
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
  );
}
