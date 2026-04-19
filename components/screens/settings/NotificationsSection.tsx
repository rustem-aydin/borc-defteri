import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const STORAGE_KEY_TIME = "@reminder_time";
const STORAGE_KEY_ENABLED = "@reminder_enabled";

export function NotificationsSection() {
  const styles = useStyles();
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadSettings();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  const loadSettings = async () => {
    try {
      const storedTime = await AsyncStorage.getItem(STORAGE_KEY_TIME);
      const storedEnabled = await AsyncStorage.getItem(STORAGE_KEY_ENABLED);
      if (storedTime) setReminderTime(new Date(storedTime));
      if (storedEnabled !== null)
        setRemindersEnabled(JSON.parse(storedEnabled));
    } catch (e) {
      console.log("Ayarlar yüklenemedi", e);
    }
  };

  const scheduleDailyNotification = async (date: Date) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      let trigger: Notifications.NotificationTriggerInput;
      if (Platform.OS === "ios") {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        };
      } else {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: date.getHours(),
          minute: date.getMinutes(),
        };
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t(`notifications.notifTitle`),
          body: i18n.t(`notifications.notifBody`),
          sound: true,
        },
        trigger,
      });
    } catch (error) {
      console.error("Bildirim ayarlanırken hata oluştu:", error);
    }
  };

  const toggleSwitch = async (value: any) => {
    setRemindersEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEY_ENABLED, JSON.stringify(value));
    if (value) {
      await scheduleDailyNotification(reminderTime);
      Alert.alert(
        i18n.t(`notifications.activated`),
        i18n.t(`notifications.activatedMessage`, {
          time: formatTime(reminderTime),
        }),
      );
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const handleTimeChange = async (event: any, selectedDate: any) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
      await AsyncStorage.setItem(STORAGE_KEY_TIME, selectedDate.toISOString());
      if (remindersEnabled) await scheduleDailyNotification(selectedDate);
    }
  };

  const formatTime = (date: any) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="notifications" size={22} color={C.primary} />
        <Text style={styles.sectionTitle}>{i18n.t(`notifications.title`)}</Text>
      </View>
      <View style={styles.card}>
        {/* Toggle Row */}
        <View style={rowStyles.container}>
          <View style={rowStyles.left}>
            <View
              style={[
                rowStyles.iconWrap,
                { backgroundColor: C.primaryContainer },
              ]}
            >
              <MaterialIcons
                name="notifications-active"
                size={20}
                color={C.onPrimaryContainer}
              />
            </View>
            <View style={rowStyles.textWrap}>
              <Text style={rowStyles.title}>
                {i18n.t(`notifications.dailyReminders`)}
              </Text>
              <Text style={rowStyles.subtitle}>
                {i18n.t(`notifications.dailyRemindersSubtitle`)}
              </Text>
            </View>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: C.surfaceContainerHighest, true: C.primary }}
            thumbColor={C.surfaceContainerLowest}
            ios_backgroundColor={C.surfaceContainerHighest}
          />
        </View>

        {/* Time Row */}
        <View style={[rowStyles.container, rowStyles.borderTop]}>
          <View style={rowStyles.left}>
            <View
              style={[
                rowStyles.iconWrap,
                { backgroundColor: C.secondaryContainer },
              ]}
            >
              <MaterialIcons
                name="schedule"
                size={20}
                color={C.onSecondaryContainer}
              />
            </View>
            <View style={rowStyles.textWrap}>
              <Text style={rowStyles.title}>
                {i18n.t(`notifications.reminderTime`)}
              </Text>
            </View>
          </View>
          <Pressable
            disabled={!remindersEnabled}
            onPress={() => setShowPicker(true)}
            style={({ pressed }) => [
              rowStyles.timeButton,
              pressed && rowStyles.timeButtonPressed,
              !remindersEnabled && rowStyles.timeButtonDisabled,
            ]}
          >
            <Text
              style={[
                rowStyles.timeButtonText,
                !remindersEnabled && rowStyles.timeButtonTextDisabled,
              ]}
            >
              {formatTime(reminderTime)}
            </Text>
          </Pressable>
        </View>
      </View>

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal transparent={true} visible={showPicker} animationType="slide">
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowPicker(false)}
          >
            <Pressable style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {i18n.t(`notifications.selectTime`)}
                </Text>
                <Pressable onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalDone}>
                    {i18n.t(`notifications.done`)}
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={reminderTime}
                mode="time"
                display="spinner"
                locale="tr-TR"
                is24Hour={true}
                onChange={handleTimeChange}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const useRowStyles = makeStyles((C) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + "26",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
    marginRight: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: C.onSurface,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.secondaryContainer,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  timeButtonPressed: {
    backgroundColor: C.secondaryContainer + "70",
  },
  timeButtonDisabled: {
    backgroundColor: C.surfaceContainerHighest,
  },
  timeButtonText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: C.onSecondaryContainer,
  },
  timeButtonTextDisabled: {
    color: C.onSurfaceVariant,
  },
}));

const useStyles = makeStyles((C) => ({
  container: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: C.onSurface,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: C.surfaceContainerLowest,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.surfaceContainerHigh,
  },
  modalTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: C.onSurface,
  },
  modalDone: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: C.primary,
  },
}));
