# Expo Notifications App

A React Native mobile application built with Expo that demonstrates **local notifications**, **WebView integration**, and **HLS video playback**. This app works seamlessly in **Expo Go** without requiring custom development builds or native code configuration.

## 🎯 Features

### Core Requirements ✅
- **WebView Screen**: Embedded web browser with notification triggers
- **Video Player Screen**: HLS streaming video playback
- **Local Notifications**: Scheduled notifications with 2-5 second delays
- **Two Action Buttons**: Trigger different notifications from WebView screen

### Bonus Features ⭐
- **Notification on WebView Load**: Automatic notification when web content finishes loading
- **Navigation on Notification Tap**: Deep linking to specific screens when notifications are tapped
- **Native Video Controls**: Full video playback controls (play, pause, seek, fullscreen)
- **WebView Navigation Controls**: Back, forward, and reload buttons

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| **Notifications** | `expo-notifications` | Works in Expo Go, no backend required, simple API |
| **WebView** | `react-native-webview` | Standard React Native WebView component |
| **Video Player** | `expo-av` | Native HLS support, built-in controls |
| **Navigation** | `expo-router` | File-based routing, integrated with Expo |
| **Language** | TypeScript | Type safety and better developer experience |

### Why Expo Local Notifications?

**✅ Advantages:**
- Works in **Expo Go** without ejecting or custom dev builds
- No backend infrastructure required
- Simple API for scheduling and managing notifications
- Perfect for user-triggered notifications (not server-driven pushes)
- Production-ready and reliable

**❌ Why NOT Firebase/OneSignal:**
- Firebase FCM requires native configuration → Won't work in Expo Go
- OneSignal needs app ID and native setup → Complicates testing
- Push notifications are NOT required for this assignment
- Local notifications are sufficient and simpler

### Project Structure

```
/app
 ├── _layout.tsx              # Root layout with notification tap handler
 ├── (tabs)/
 │    ├── _layout.tsx         # Tab navigation
 │    ├── index.tsx           # Home screen
 │    └── explore.tsx         # Explore tab
 ├── webview.tsx              # WebView screen with notification buttons
 ├── video.tsx               # HLS video player screen
 └── modal.tsx               # Modal screen
/utils
 └── notifications.ts         # Notification utility functions
/components
 └── ...                     # Reusable UI components
```

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Expo Go app installed on your iOS/Android device

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

3. **Run on Device**
   - Scan QR code with Expo Go app (iOS Camera or Android Expo Go)
   - Or press `i` for iOS simulator / `a` for Android emulator

## 🚀 Usage

### WebView Screen

1. Navigate to **WebView** screen from home
2. WebView loads `https://example.com` automatically
3. **Bonus**: Notification appears 2 seconds after page loads
4. Click **"Notify Action A (3s)"** button → Notification appears in 3 seconds
5. Click **"Notify Action B (5s)"** button → Notification appears in 5 seconds
6. Use navigation controls (Back, Forward, Reload) to browse

### Video Player Screen

1. Navigate to **Video Player** screen from home
2. HLS video stream loads automatically
3. Use native video controls:
   - Play/Pause
   - Seek bar
   - Fullscreen mode
   - Volume control

### Notification Navigation (Bonus)

1. Schedule a notification with navigation data:
   ```typescript
   scheduleNotification(
     'Watch Video',
     'Tap to open video player',
     3,
     { screen: 'Video' }
   );
   ```
2. Tap the notification when it appears
3. App automatically navigates to the specified screen

## 🔔 Notification Implementation Details

### Permission Handling

The app automatically requests notification permissions on first use. Permissions are required for:
- Scheduling notifications
- Displaying notifications
- Handling notification taps

### Notification Scheduling

```typescript
import { scheduleNotification } from '@/utils/notifications';

// Schedule a notification with 3 second delay
await scheduleNotification(
  'Title',
  'Body text',
  3, // delay in seconds
  { screen: 'video' } // optional navigation data
);
```

### Notification Tap Handler

Located in `app/_layout.tsx`, the handler listens for notification taps and navigates based on data:

```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  if (data?.screen === 'Video') {
    router.push('/video');
  }
});
```

## 🎥 Video Player Implementation

### HLS Streaming

The app uses `expo-av` for video playback with native HLS support:

```typescript
<Video
  source={{ uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }}
  useNativeControls={true}
  resizeMode={ResizeMode.CONTAIN}
  shouldPlay={false}
/>
```

### Features
- **Native Controls**: Play, pause, seek, fullscreen
- **HLS Support**: Adaptive bitrate streaming
- **Error Handling**: Graceful error messages
- **Loading States**: Visual feedback during buffering

## 📱 Platform Support

- ✅ **iOS**: Full support (Expo Go)
- ✅ **Android**: Full support (Expo Go)
- ⚠️ **Web**: Limited support (notifications not available on web)

## 🧪 Testing

### Manual Testing Checklist

- [ ] WebView loads successfully
- [ ] Action A button triggers notification (3s delay)
- [ ] Action B button triggers notification (5s delay)
- [ ] WebView load notification appears (2s delay)
- [ ] Video player loads and plays HLS stream
- [ ] Video controls work (play, pause, seek)
- [ ] Notification tap navigates to correct screen
- [ ] App handles notification permission denial gracefully

### Test Scenarios

1. **First Launch**: App requests notification permissions
2. **Permission Denied**: App shows error alerts when scheduling fails
3. **Multiple Notifications**: Multiple notifications can be scheduled
4. **Notification Tap**: Tapping notification navigates to screen
5. **Video Playback**: Video plays smoothly with controls

## 🎨 UI/UX Features

- **Themed Components**: Dark/light mode support
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Navigation**: Smooth transitions between screens
- **Accessibility**: Proper button labels and touch targets

## 📚 Key Files

| File | Purpose |
|------|---------|
| `utils/notifications.ts` | Notification scheduling and permission handling |
| `app/webview.tsx` | WebView screen with notification buttons |
| `app/video.tsx` | HLS video player implementation |
| `app/_layout.tsx` | Root layout with notification tap handler |
| `app/(tabs)/index.tsx` | Home screen with navigation |

## 🔧 Configuration

### Notification Behavior

Configured in `utils/notifications.ts`:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

### Video Player Settings

- **Resize Mode**: `CONTAIN` (maintains aspect ratio)
- **Controls**: Native controls enabled
- **Auto-play**: Disabled (user must press play)

## 🐛 Troubleshooting

### Notifications Not Appearing

1. **Check Permissions**: Ensure notification permissions are granted
2. **Check Device Settings**: Verify notifications are enabled in device settings
3. **Check Console**: Look for error messages in Expo DevTools

### Video Not Playing

1. **Check Internet**: HLS stream requires internet connection
2. **Check URL**: Verify HLS stream URL is accessible
3. **Check Logs**: Look for playback errors in console

### Navigation Not Working

1. **Check Notification Data**: Ensure `data.screen` is set correctly
2. **Check Route Names**: Verify route names match (`/video`, `/webview`)
3. **Check Handler**: Ensure notification tap handler is registered

## 📝 Interview-Ready Explanation

> **"I chose Expo Local Notifications because the app needs to run in Expo Go without ejecting or custom dev builds. Since the requirement is user-triggered notifications (not server-driven push notifications), local notifications are more reliable, simpler, and production-safe for this use case. They work seamlessly across iOS and Android, require no backend infrastructure, and provide all the functionality needed for this assignment."**

## 🚀 Future Enhancements

Potential improvements (not required for assignment):

- [ ] Custom notification sounds
- [ ] Notification categories and actions
- [ ] Background notification handling
- [ ] Notification history/logs
- [ ] Custom video player controls
- [ ] Picture-in-picture mode
- [ ] Offline video caching

## 📄 License

This project is created for educational/demonstration purposes.

## 👤 Author

Built with Expo and React Native for demonstration of local notifications, WebView integration, and HLS video playback.

---

**Note**: This app is designed to work in **Expo Go** without requiring custom development builds, making it easy to test and evaluate.
# houseofedtech
# houseofedtech
