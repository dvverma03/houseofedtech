import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { RootStackParamList } from "@/src/navigation/types";
import { scheduleNotification } from "@/src/utils/notifications";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { HomepageSection } from "../components/HomePageItem";
import { createHomepageData } from "../constant/homePageData";
import { HomepageDataItem } from "../constant/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();

  // Navigation handlers - wrapped in useCallback for stable references
  const navigateToWebView = useCallback(() => {
    navigation.navigate("WebView");
  }, [navigation]);

  const navigateToVideo = useCallback(() => {
    navigation.navigate("Video");
  }, [navigation]);

  const handleTestNotification = useCallback(async () => {
    try {
      await scheduleNotification(
        "Test Notification",
        "This notification only for testing purpose",
        2,
        { screen: "webview" },
      );
      Alert.alert(
        "Success",
        "Test notification scheduled!, it will appear in 2 seconds",
      );
    } catch {
      Alert.alert("Error", "Failed to schedule notification");
    }
  }, []);

  // Create homepage data with action handlers
  const homepageData = useMemo(
    () =>
      createHomepageData(
        navigateToWebView,
        navigateToVideo,
        handleTestNotification,
      ),
    [navigateToWebView, navigateToVideo, handleTestNotification],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Media Experience Hub
        </ThemedText>
      </ThemedView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: 22,
            color: colorScheme === "dark" ? "#fff" : "#000",
            textAlign: "center",
            marginTop: 20,
            marginHorizontal: "10%",
            lineHeight: 32,
          }}
        >
          Explore Interactive Media
        </ThemedText>

        <ThemedText
          style={{
            fontSize: 14,
            color: colorScheme === "dark" ? "#fff" : "#000",
            textAlign: "center",
            marginHorizontal: "10%",
            lineHeight: 20,
            fontWeight: "500",
            marginTop: 8,
          }}
        >
          Experience a seamless combination of web content, real-time
          notifications, and high-quality video streaming — all inside a single
          Expo-powered React Native app.
        </ThemedText>

        <ThemedView style={styles.content}>
          <ThemedView>
            {homepageData?.map((item) => (
              <HomepageSection key={item?.id} item={item as HomepageDataItem} />
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
