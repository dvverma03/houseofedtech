# Quick Setup Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `expo-notifications` - Local notifications
- `react-native-webview` - WebView component
- `expo-av` - Video player with HLS support
- All other required dependencies

### Step 2: Start the Development Server

```bash
npm start
# or
expo start
```

### Step 3: Run on Your Device

**Option A: Expo Go (Recommended)**
- Install Expo Go app on your iOS/Android device
- Scan the QR code displayed in terminal
- App will load in Expo Go

**Option B: Simulator/Emulator**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator

## ✅ Testing Checklist

### WebView Screen
1. Tap "🌐 Open WebView" on home screen
2. Wait for page to load → Notification appears in 2 seconds (bonus)
3. Tap "Notify Action A (3s)" → Notification appears in 3 seconds
4. Tap "Notify Action B (5s)" → Notification appears in 5 seconds

### Video Player Screen
1. Tap "🎥 Open Video Player" on home screen
2. Video loads automatically
3. Tap play button to start playback
4. Use native controls (seek, fullscreen, etc.)

### Notification Navigation (Bonus)
1. Tap "🔔 Test Notification" on home screen
2. Wait 2 seconds for notification
3. Tap the notification → App navigates to WebView screen

## 📱 Permissions

On first launch, the app will request notification permissions. **Grant permissions** to enable all features.

## 🐛 Troubleshooting

### Notifications Not Working?
- Check device notification settings
- Ensure permissions are granted
- Restart the app

### Video Not Playing?
- Check internet connection
- HLS stream requires active connection
- Try reloading the screen

### Build Errors?
- Run `npm install` again
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall

## 📚 Next Steps

See `README.md` for complete documentation and architecture details.
