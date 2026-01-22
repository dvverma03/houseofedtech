import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Configure notification behavior
 * This sets how notifications appear when the app is in foreground
 * 
 * NOTE: Local notifications work in Expo Go, but remote/push notifications
 * require a development build (SDK 53+). See: https://docs.expo.dev/develop/development-builds/introduction/
 */
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true, // Show notification banner (replaces deprecated shouldShowAlert)
      shouldShowList: true,   // Show in notification list
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  // Log error for debugging but don't block execution
  // Local notifications should still work even if handler setup fails
  if (__DEV__) {
    console.warn('Notification handler setup warning:', error);
  }
}

/**
 * Request notification permissions
 * Must be called before scheduling notifications
 * 
 * NOTE: Local notifications work in Expo Go.
 * Remote/push notifications require a development build on Android (SDK 53+).
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    // In Expo Go, this might fail silently - that's expected
    return false;
  }
}

/**
 * Schedule a local notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param delaySeconds - Delay in seconds before showing notification (default: 3)
 * @param data - Optional data object to pass with notification (useful for navigation)
 * 
 * NOTE: Local notifications work in Expo Go.
 * For production apps, consider using a development build for better notification support.
 */
export async function scheduleNotification(
  title: string,
  body: string,
  delaySeconds: number = 3,
  data?: Record<string, any>
): Promise<string> {
  try {
    // Request permissions first
    const permissionGranted = await requestNotificationPermissions();

    if (!permissionGranted) {
      const errorMsg = 'Notification permissions not granted. Please enable notifications in device settings.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Ensure delaySeconds is valid (minimum 1 second)
    const validDelaySeconds = Math.max(1, Math.floor(delaySeconds));

    // Create trigger for time-based notification
    // Use TimeIntervalTriggerInput type with explicit type property
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: validDelaySeconds,
    };

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data, // Used for navigation on tap
        sound: true,
      },
      trigger,
    });

    if (__DEV__) {
      console.log(`Notification scheduled successfully. ID: ${notificationId}, will appear in ${validDelaySeconds} seconds`);
    }

    return notificationId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to schedule notification:', errorMessage, error);

    // Provide helpful error messages
    if (Platform.OS === 'android' && errorMessage.includes('remote')) {
      console.warn('Note: Android push notifications require a development build in SDK 53+. Local notifications should still work.');
    }

    throw error;
  }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - ID of notification to cancel
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}
