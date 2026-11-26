// app/index.tsx
import { hasPin } from "@/lib/auth";
import { i18n } from "@/lib/i18n";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { AppState } from "react-native";

export default function Index() {
  const [redirect, setRedirect] = useState<
    "/onboarding" | "/home" | "/pin/setup" | "/pin/unlock" | null
  >(null);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Dil ayarını hemen yap
        i18n.locale = getLocales()[0].languageCode ?? "en";

        // Auth kontrolü — okumalar paralel yapılır.
        const [exists, protectionEnabled, seenOnboarding] = await Promise.all([
          hasPin(),
          AsyncStorage.getItem("pinProtectionEnabled"),
          hasSeenOnboarding(),
        ]);
        const isEnabled =
          protectionEnabled === null ? true : protectionEnabled === "true";

        // Daha önce kurulmuş bir uygulama (PIN veya koruma ayarı var) tanıtımı
        // atlar; yalnızca gerçek ilk açılışta gösterilir.
        const isExistingUser = exists || protectionEnabled !== null;
        if (!seenOnboarding) {
          if (isExistingUser) {
            await markOnboardingSeen();
          } else {
            setRedirect("/onboarding");
            return;
          }
        }

        if (exists && isEnabled) {
          setRedirect("/pin/unlock");
        } else if (!exists && isEnabled) {
          setRedirect("/pin/setup");
        } else {
          setRedirect("/home");
        }
      } catch (e) {
        console.warn("Auth check failed", e);
        setRedirect("/home");
      } finally {
        // Her şey hazır olduğunda splash screen'i gizle
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // AppState değişikliklerinde dil güncellemesi (Ağır işlem değil, optimize edilmiş)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        i18n.locale = getLocales()[0].languageCode ?? "en";
      }
    });

    return () => subscription.remove();
  }, []);

  // Hazır değilse hiçbir şey render etme (Boş ekran yerine Splash Screen kalır)
  if (!isAppReady || !redirect) {
    return null;
  }

  // DÜZELTME: redirect değerinin null olmadığını garanti etmek için "!" (non-null assertion) kullandık.
  return <Redirect href={redirect!} />;
}
