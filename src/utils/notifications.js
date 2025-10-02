import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure behavior when a notification arrives
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permission
export async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert("Permission for notifications not granted!");
      return null;
    }
  }
  return true;
}

// Schedule daily reminder
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync(); // avoid duplicates
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💰 Expense Reminder",
      body: "Don’t forget to log today’s expenses!",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}
