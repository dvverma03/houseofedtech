import { useColorScheme } from "@/src/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import HomeScreen from "@/src/screens/HomeScreen";
import VideoScreen from "@/src/screens/VideoScreen";
import WebViewScreen from "@/src/WebView/WebViewScreen";
import { navigationRef } from "./navigationRef";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    let responseSub: Notifications.Subscription | null = null;

    try {
      responseSub = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data;
          if (data?.screen === "Video" || data?.screen === "video") {
            navigationRef.current?.navigate("Video");
          } else if (data?.screen === "WebView" || data?.screen === "webview") {
            navigationRef.current?.navigate("WebView");
          }
        },
      );
    } catch {
      if (__DEV__) {
        console.log(
          "Notification listener setup (local notifications work fine)",
        );
      }
    }

    return () => {
      try {
        if (responseSub) {
          responseSub.remove();
        }
      } catch {
        __DEV__ && console.log("Notification listener cleanup failed");
      }
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="Video"
          component={VideoScreen}
          options={{
            title: "Video Player",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="WebView"
          component={WebViewScreen}
          options={{
            title: "Embedded Web Experience",
            headerShown: true,
            presentation: "card",
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
            },
            headerTitleStyle: {
              fontWeight: "600",
              fontSize: 18,
            },
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
              flex: 1,
            },
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
