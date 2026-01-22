# Important Notes

## Warnings and Limitations

### 1. Expo Notifications Warnings
**Status**: ✅ **App works correctly** - These are informational warnings only.

- **Local notifications work perfectly** in Expo Go
- The warning about "Android Push notifications" refers to **remote/push notifications**, not local notifications
- Local notifications (scheduled notifications) work as expected
- To use push notifications, you would need a development build (not required for this project)

**What you see:**
```
WARN expo-notifications: Android Push notifications functionality was removed from Expo Go
```

**What it means:**
- Local notifications ✅ Work fine
- Push notifications ❌ Require development build (not needed for this project)

### 2. Expo AV Deprecation Warning
**Status**: ⚠️ **Informational** - Package still works, but Expo recommends migrating to `expo-video`

- `expo-av` is deprecated and will be removed in SDK 54
- Recommended migration: Use `expo-video` package instead
- Current implementation works fine, but consider migrating in the future

**Current Status:**
- ✅ Video playback works correctly
- ⚠️ Deprecation warning appears (informational only)
- 📝 Future: Migrate to `expo-video` when ready

### 3. App Functionality
All core features work correctly:
- ✅ Local notifications (2-5 second delays)
- ✅ WebView with notification triggers
- ✅ HLS video playback
- ✅ Navigation on notification tap
- ✅ Stack navigation (no tabs)

## Development Build (Optional)

If you want to eliminate all warnings, you can create a development build:
```bash
npx expo prebuild
npx expo run:android
# or
npx expo run:ios
```

However, **this is not required** - the app works perfectly in Expo Go with local notifications.
