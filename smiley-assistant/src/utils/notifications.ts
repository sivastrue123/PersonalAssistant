import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export async function requestNotificationPermission() {
  if (Capacitor.isNativePlatform()) {
    return await LocalNotifications.requestPermissions();
  } else {
    return await Notification.requestPermission();
  }
}

export async function scheduleNotification(id: number, title: string, body: string, scheduleDate: Date) {
  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: { at: scheduleDate },
          sound: 'beep.wav',
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } else {
    // Web implementation (simple timeout for demo purposes as browser notifications are limited)
    const delay = scheduleDate.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        new Notification(title, { body });
      }, delay);
    }
  }
}

export async function scheduleRecurringNotifications() {
  // Clear existing
  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });
  }

  const now = new Date();

  // Water: Every 30 mins
  // Breath: Every 15 mins
  // Joke: Every 45 mins

  // For demo, we schedule just one of each a few seconds/minutes from now
  // In a real app, we'd use 'every' property of LocalNotifications or a background worker.

  // Water
  const waterTime = new Date(now.getTime() + 30 * 60 * 1000);
  scheduleNotification(1, "Hydration Time 💧", "Hey love ❤️ Drink some water, your smile needs hydration.", waterTime);

  // Breath
  const breathTime = new Date(now.getTime() + 15 * 60 * 1000);
  scheduleNotification(2, "Breathe... 🌿", "Pause… breathe in 🌿 breathe out 🌸", breathTime);

  // Joke
  const jokeTime = new Date(now.getTime() + 45 * 60 * 1000);
  scheduleNotification(3, "Chemistry Joke 🧪", "Why did the chemist break up? Check the app!", jokeTime);
}
