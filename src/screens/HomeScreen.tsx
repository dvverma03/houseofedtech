import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { RootStackParamList } from "@/src/navigation/types";
import { scheduleNotification } from "@/src/utils/notifications";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import {
  Alert,
  Dimensions,
  StyleSheet,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Slider from "../components/Slider";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;
const IMAGE_HEIGHT = IMAGE_WIDTH * (1800 / 2395);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();

  const navigateToWebView = () => {
    navigation.navigate("WebView");
  };

  const navigateToVideo = () => {
    navigation.navigate("Video");
  };

  const handleTestNotification = async () => {
    try {
      await scheduleNotification(
        "Test Notification",
        "This is a test notification from the home screen",
        2,
        { screen: "webview" },
      );
      Alert.alert("Success", "Test notification scheduled!");
    } catch (error) {
      Alert.alert("Error", "Failed to schedule notification");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          House Of Edtech
        </ThemedText>
      </ThemedView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
        }}
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.buttonContainer}>
            <View style={[styles.button]}>
              <Image
                source={{
                  uri: "https://cdn.dribbble.com/userupload/6428123/file/original-aab84503fd846a3ca140ea0c2f09e6a7.png?crop=0x0-2395x1800&format=webp&resize=400x300&vertical=center",
                }}
                style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                contentFit="contain"
              />
              <View style={{ marginTop: 12 }}></View>
              <Slider
                onSwipeComplete={navigateToWebView}
                text="Swipe to open Webview"
                successMessage="Swiped Successfully!"
              />
            </View>

            <View style={[styles.button]}>
              <Image
                source={{
                  uri: "https://flutterx.com/thumbnails/artifact-2982.jpeg",
                }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                }}
                contentFit="contain"
              />
              <View style={{ marginTop: 12 }}></View>
              <Slider
                onSwipeComplete={navigateToVideo}
                text="Swipe to Play Video"
                successMessage="Swiped Successfully!"
              />
            </View>
            <View style={[styles.button]}>
              <Image
                source={{
                  uri: "https://img.freepik.com/premium-vector/push-notifications-concept-illustration_114360-4730.jpg?semt=ais_hybrid&w=740&q=80",
                }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                }}
                contentFit="contain"
              />
              <View style={{ marginTop: 12 }}></View>
              <Slider
                onSwipeComplete={handleTestNotification}
                text="Swipe to Test Notification"
                successMessage="Swiped Successfully!"
              />
            </View>
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  buttonContainer: {},
  button: {
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: 24,
  },
  testButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  infoSection: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
});
