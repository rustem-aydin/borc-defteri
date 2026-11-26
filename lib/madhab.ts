import { Madhab } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const MADHAB_KEY = "@borc_defteri/madhab";
export const MADHAB_UPDATED_EVENT = "MadhabUpdated";
export const DEFAULT_MADHAB: Madhab = "hanefi";
export const MADHABS: Madhab[] = ["hanefi", "safii"];

export function isMadhab(value: unknown): value is Madhab {
  return value === "hanefi" || value === "safii";
}

export async function getMadhab(): Promise<Madhab> {
  try {
    const stored = await AsyncStorage.getItem(MADHAB_KEY);
    return isMadhab(stored) ? stored : DEFAULT_MADHAB;
  } catch (error) {
    console.warn("Madhab could not be read", error);
    return DEFAULT_MADHAB;
  }
}

export async function saveMadhab(madhab: Madhab): Promise<void> {
  try {
    await AsyncStorage.setItem(MADHAB_KEY, madhab);
    DeviceEventEmitter.emit(MADHAB_UPDATED_EVENT, madhab);
  } catch (error) {
    console.warn("Madhab could not be saved", error);
  }
}
