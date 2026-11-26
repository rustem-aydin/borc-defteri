import { Madhab } from "@/constants/colors";
import {
  DEFAULT_MADHAB,
  getMadhab,
  isMadhab,
  MADHAB_UPDATED_EVENT,
  saveMadhab,
} from "@/lib/madhab";
import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export function useMadhab() {
  const [madhab, setMadhabState] = useState<Madhab>(DEFAULT_MADHAB);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    getMadhab().then((stored) => {
      if (!mounted) return;
      setMadhabState(stored);
      setReady(true);
    });

    const subscription = DeviceEventEmitter.addListener(
      MADHAB_UPDATED_EVENT,
      (next: unknown) => {
        if (isMadhab(next)) setMadhabState(next);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const setMadhab = useCallback(async (next: Madhab) => {
    setMadhabState(next);
    await saveMadhab(next);
  }, []);

  return { madhab, ready, setMadhab };
}
