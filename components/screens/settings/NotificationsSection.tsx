import { makeStyles } from "@/hooks/make-styles";
import { i18n } from "@/lib/i18n";
import { useTheme } from "@/lib/ThemeContext";
import {
  cancelReminders,
  defaultReminderTime,
  ensureNotificationPermission,
  loadReminderSettings,
  saveReminderSettings,
  scheduleDailyReminder,
} from "@/lib/notifications";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";


export function NotificationsSection() {
  const styles = useStyles();
  const rowStyles = useRowStyles();
  const { colors: C } = useTheme();

  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date>(defaultReminderTime());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    loadReminderSettings()
      .then((settings) => {
        if (!active) return;
        setRemindersEnabled(settings.enabled);
        setReminderTime(settings.time);
      })
      .catch((error) => console.warn("Hatırlatıcı ayarları okunamadı", error));
    return () => {
      active = false;
    };
  }, []);

  const persist = (enabled: boolean, time: Date) =>
    saveReminderSettings({ enabled, time });

  const toggleSwitch = async (value: boolean) => {
    if (saving) return;
    setSaving(true);
    try {
      if (value) {
        // İzin yalnızca kullanıcı açıkça açtığında istenir.
        const granted = await ensureNotificationPermission();
        if (!granted) {
          Alert.alert(
            i18n.t("notifications.permissionDenied"),
            i18n.t("notifications.permissionDeniedMessage"),
            [
              { text: i18n.t("notifications.cancel"), style: "cancel" },
              {
                text: i18n.t("notifications.openSettings"),
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return;
        }

        await scheduleDailyReminder(reminderTime);
        setRemindersEnabled(true);
        await persist(true, reminderTime);
        Alert.alert(
          i18n.t("notifications.activated"),
          i18n.t("notifications.activatedMessage", {
            time: formatTime(reminderTime),
          }),
        );
      } else {
        await cancelReminders();
        setRemindersEnabled(false);
        await persist(false, reminderTime);
      }
    } catch (error) {
      console.warn("Hatırlatıcı güncellenemedi", error);
      Alert.alert(
        i18n.t("notifications.error"),
        i18n.t("notifications.errorMessage"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = async (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (!selectedDate) return;

    setReminderTime(selectedDate);
    await persist(remindersEnabled, selectedDate);
    if (remindersEnabled) {
      try {
        await scheduleDailyReminder(selectedDate);
      } catch (error) {
        console.warn("Hatırlatıcı saati güncellenemedi", error);
      }
    }
  };

  const formatTime = (date: Date) => {
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
            disabled={saving}
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
