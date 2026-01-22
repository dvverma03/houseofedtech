# Installation Instructions

## ✅ Fixed Version Issue

The `expo-av` version has been updated in `package.json`. Now run:

## Recommended: Use Expo Install (Auto-compatible versions)

```bash
npx expo install expo-av expo-notifications react-native-webview
```

This command automatically installs versions compatible with your Expo SDK 54.

## Alternative: Standard npm install

If `npx expo install` doesn't work, you can try:

```bash
npm install
```

The `package.json` has been updated with compatible versions:
- `expo-av`: `~15.1.7` (compatible with SDK 54)
- `expo-notifications`: `~0.29.19` (already correct)
- `react-native-webview`: `15.1.2` (already correct)

## Troubleshooting

If you still get version errors:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Remove node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use Expo CLI to install (recommended):**
   ```bash
   npx expo install expo-av expo-notifications react-native-webview
   ```

4. **Check your Expo SDK version:**
   ```bash
   npx expo --version
   ```
   Should show SDK 54.

## After Installation

Once installed successfully, start the app:

```bash
npm start
```

Then scan the QR code with Expo Go app on your device.
