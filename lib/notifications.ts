// Günlük hatırlatıcının tek sahibi: kanal, izin, zamanlama ve uygulama
// açılışındaki uzlaştırma (reconcile) burada toplanır.
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";
import { Platform } from "react-native";

import { i18n } from "@/lib/i18n";

export const REMINDER_TIME_KEY = "@reminder_time";
export const REMINDER_ENABLED_KEY = "@reminder_enabled";

/** Android 8+ zorunlu: bildirimin sesi/titreşimi bu kanaldan gelir. */
export const REMINDER_CHANNEL_ID = "reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let reminderChannelReady = false;

/**
 * Android 8+ için kanal. Bazı çalışma zamanlarında (ör. Expo Go) kanal
 * seçenekleri reddedilebiliyor; o durumda kanal kurulmadan devam edilir,
 * bildirim sistemin varsayılan kanalıyla gösterilir.
 */
export async function ensureReminderChannel(): Promise<boolean> {
  if (Platform.OS !== "android") return false;
  if (reminderChannelReady) return true;
  try {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: i18n.t("notifications.channelName"),
      importance: AndroidImportance.HIGH,
      sound: "default",
    });
    reminderChannelReady = true;
  } catch (error) {
    console.warn("Bildirim kanalı kurulamadı, varsayılan kanal kullanılacak", error);
  }
  return reminderChannelReady;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  // Bazı çalışma zamanlarında iptal sessizce yarım kalabildiği için doğrula.
  const remaining = await Notifications.getAllScheduledNotificationsAsync();
  if (remaining.length > 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.info("Kalan zamanlanmış bildirim", remaining.length);
  }
}

/** Verilen saat için her gün tekrarlayan hatırlatıcıyı kurar. */
export async function scheduleDailyReminder(date: Date): Promise<void> {
  await cancelReminders();
  const channelReady =
    Platform.OS === "android" ? await ensureReminderChannel() : false;

  const trigger: Notifications.NotificationTriggerInput =
    Platform.OS === "ios"
      ? {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: date.getHours(),
          minute: date.getMinutes(),
          ...(channelReady ? { channelId: REMINDER_CHANNEL_ID } : {}),
        };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notifications.notifTitle"),
      body: i18n.t("notifications.notifBody"),
      sound: "default",
    },
    trigger,
  });
}

export interface ReminderSettings {
  enabled: boolean;
  time: Date;
}

/** Ayarları diskten okur; kayıt yoksa varsayılan (kapalı, 20:00). */
export async function loadReminderSettings(): Promise<ReminderSettings> {
  const [storedTime, storedEnabled] = await Promise.all([
    AsyncStorage.getItem(REMINDER_TIME_KEY),
    AsyncStorage.getItem(REMINDER_ENABLED_KEY),
  ]);

  const parsed = storedTime ? new Date(storedTime) : null;
  const time =
    parsed && !Number.isNaN(parsed.getTime())
      ? parsed
      : defaultReminderTime();

  return { enabled: storedEnabled === "true", time };
}

export function defaultReminderTime(): Date {
  const date = new Date();
  date.setHours(20, 0, 0, 0);
  return date;
}

export async function saveReminderSettings(settings: ReminderSettings) {
  await Promise.all([
    AsyncStorage.setItem(REMINDER_ENABLED_KEY, String(settings.enabled)),
    AsyncStorage.setItem(REMINDER_TIME_KEY, settings.time.toISOString()),
  ]);
}

/**
 * Uygulama açılışında çağrılır: ayar açıksa zamanlanmış bildirimin gerçekten
 * durduğunu doğrular, yoksa (yeniden kurulum, OS temizliği) yeniden kurar.
 */
export async function reconcileDailyReminder(): Promise<void> {
  try {
    const { enabled, time } = await loadReminderSettings();

    if (!enabled) {
      // Kapalıyken artık kalmış bir zamanlama varsa temizle.
      const stale = await Notifications.getAllScheduledNotificationsAsync();
      if (stale.length > 0) await cancelReminders();
      return;
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    if (scheduled.length > 0) return;

    const granted = await ensureNotificationPermission();
    if (!granted) return;

    await scheduleDailyReminder(time);
  } catch (error) {
    console.warn("Hatırlatıcı uzlaştırılamadı", error);
  }
}
