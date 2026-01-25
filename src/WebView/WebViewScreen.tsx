import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Colors } from "@/src/config/theme";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { scheduleNotification } from "@/src/utils/notifications";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const colorScheme = useColorScheme();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = async () => {
    setLoading(false);

    // Notification when WebView loads
    try {
      await scheduleNotification(
        "Website Loaded",
        "The web content has finished loading successfully",
        2,
      );
    } catch (error) {
      console.error("Failed to schedule load notification:", error);
    }
  };

  const handleActionA = async () => {
    try {
      await scheduleNotification(
        "Action A Triggered",
        "You clicked Action A button. Notification will appear in 3 seconds.",
        3,
        { screen: "webview", action: "A" },
      );
      Alert.alert("Success", "Notification scheduled for Action A (3 seconds)");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to schedule notification. Please check permissions.",
      );
      console.error("Notification error:", error);
    }
  };

  const handleActionB = async () => {
    try {
      await scheduleNotification(
        "Action B Triggered",
        "You clicked Action B button. Notification will appear in 5 seconds.",
        5,
        { screen: "webview", action: "B" },
      );
      Alert.alert("Success", "Notification scheduled for Action B (5 seconds)");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to schedule notification. Please check permissions.",
      );
      console.error("Notification error:", error);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const handleGoBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={Colors[colorScheme ?? "light"].tint}
            />
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: "https://houseofedtech.in" }}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </ThemedView>

      <ThemedView style={styles.notificationButtons}>
        <ThemedView
          style={[
            styles.button,
            styles.actionButton,
            !canGoBack && styles.buttonDisabled,
          ]}
          onTouchEnd={handleGoBack}
        >
          <ThemedText style={styles.buttonText}>◀︎</ThemedText>
        </ThemedView>

        <ThemedView
          style={[
            styles.button,
            styles.actionButton,
            !canGoForward && styles.buttonDisabled,
          ]}
          onTouchEnd={handleGoForward}
        >
          <ThemedText style={styles.buttonText}>▶︎</ThemedText>
        </ThemedView>
        <ThemedView
          style={[styles.button, styles.primaryButton]}
          onTouchEnd={handleActionA}
        >
          <ThemedText style={styles.buttonText}>🔔</ThemedText>
          <ThemedText style={styles.buttonSmallText}>Notify in 3s</ThemedText>
        </ThemedView>
        <ThemedView
          style={[styles.button, styles.secondaryButton]}
          onTouchEnd={handleActionB}
        >
          <ThemedText style={styles.buttonText}>🔔</ThemedText>
          <ThemedText style={styles.buttonSmallText}>Notify in 5s</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  webViewContainer: {
    flex: 1,
    position: "relative",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  controlsContainer: {
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  notificationButtons: {
    gap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    width: "100%",
    marginVertical: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  actionButton: {
    backgroundColor: "#8E8E93",
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSmallText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
