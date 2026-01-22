import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { scheduleNotification } from "@/src/utils/notifications";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { VIDEO_STREAMS } from "../constant/videoPlayerData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio

const SEEK_INTERVAL = 10; // seconds to skip forward/backward
const SKIP_INTERVAL = 30; // seconds for skip buttons

export default function VideoScreen() {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const currentStream = VIDEO_STREAMS[currentStreamIndex];

  // Send notification when video finishes loading
  const handleVideoLoad = async () => {
    setIsLoading(false);
    setError(null);
    
    if (!hasLoadedOnce) {
      setHasLoadedOnce(true);
      try {
        await scheduleNotification(
          "Video Loaded",
          `${currentStream.name} is ready to play!`,
          1,
          { screen: "Video" } // Opens Video screen when tapped
        );
      } catch (error) {
        __DEV__ && console.warn("Failed to send video loaded notification:", error);
      }
    }
  };

  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
      setPosition(playbackStatus.positionMillis / 1000); // Convert to seconds
      
      if (playbackStatus.durationMillis) {
        setDuration(playbackStatus.durationMillis / 1000); // Convert to seconds
      }

      // Update mute state
      if (playbackStatus.isMuted !== undefined) {
        setIsMuted(playbackStatus.isMuted);
      }
    } else {
      // Handle loading state errors
      if (!playbackStatus.isLoaded && "error" in playbackStatus) {
        const errorMessage =
          typeof playbackStatus.error === "string"
            ? playbackStatus.error
            : "Failed to load video";
        setError(`Failed to load video: ${errorMessage}`);
        Alert.alert("Load Error", errorMessage);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    } catch (error) {
      __DEV__ && console.error("Play/Pause error:", error);
      Alert.alert("Error", "Failed to play/pause video");
    }
  };

  const handleSeekForward = async () => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(
          status.positionMillis + SEEK_INTERVAL * 1000,
          status.durationMillis || status.positionMillis
        );
        await videoRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      __DEV__ && console.error("Seek forward error:", error);
    }
  };

  const handleSeekBackward = async () => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(
          status.positionMillis - SEEK_INTERVAL * 1000,
          0
        );
        await videoRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      __DEV__ && console.error("Seek backward error:", error);
    }
  };

  const handleSkipForward = async () => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(
          status.positionMillis + SKIP_INTERVAL * 1000,
          status.durationMillis || status.positionMillis
        );
        await videoRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      __DEV__ && console.error("Skip forward error:", error);
    }
  };

  const handleSkipBackward = async () => {
    if (!videoRef.current) return;

    try {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(
          status.positionMillis - SKIP_INTERVAL * 1000,
          0
        );
        await videoRef.current.setPositionAsync(newPosition);
      }
    } catch (error) {
      __DEV__ && console.error("Skip backward error:", error);
    }
  };

  const handleToggleMute = async () => {
    if (!videoRef.current) return;

    try {
      // Get current playback status directly from video ref to ensure accuracy
      const status = await videoRef.current.getStatusAsync();
      
      if (!status.isLoaded) {
        return;
      }

      const wasPlaying = status.isPlaying;
      const newMuteState = !isMuted;
      
      // Toggle mute and immediately check/resume playback if needed
      await videoRef.current.setIsMutedAsync(newMuteState);
      setIsMuted(newMuteState);
      
      // If video was playing, check status after mute and resume if paused
      if (wasPlaying) {
        // Check status immediately after mute operation
        const statusAfterMute = await videoRef.current.getStatusAsync();
        
        // If video got paused during mute operation, resume it
        if (statusAfterMute.isLoaded && !statusAfterMute.isPlaying) {
          await videoRef.current.playAsync();
        }
      }
    } catch (error) {
      __DEV__ && console.error("Mute toggle error:", error);
      Alert.alert("Error", "Failed to toggle mute");
    }
  };

  const handleSwitchStream = async (index: number) => {
    if (index === currentStreamIndex) return;

    try {
      setCurrentStreamIndex(index);
      setIsLoading(true);
      setError(null);
      setHasLoadedOnce(false);
      setPosition(0);
      
      // Reload video with new source
      if (videoRef.current) {
        await videoRef.current.unloadAsync();
        await videoRef.current.loadAsync(
          { uri: VIDEO_STREAMS[index].url },
          { shouldPlay: false }
        );
      }
    } catch (error) {
      __DEV__ && console.error("Stream switch error:", error);
      Alert.alert("Error", "Failed to switch video stream");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.videoContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ThemedText style={styles.loadingText}>Loading video...</ThemedText>
          </View>
        )}

        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: currentStream.url,
          }}
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={false}
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoadStart={() => {
            setError(null);
            setIsLoading(true);
          }}
          onLoad={handleVideoLoad}
          onError={(error: any) => {
            const errorMessage =
              typeof error === "string"
                ? error
                : error?.message || error?.toString() || "Unknown error";
            setError(`Video error: ${errorMessage}`);
            setIsLoading(false);
            Alert.alert("Video Error", errorMessage);
          }}
        />
      </ThemedView>

      {/* Custom Controls */}
      <ThemedView style={styles.customControlsContainer}>
        {/* Playback Controls Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSkipBackward}
          >
            <ThemedText style={styles.controlButtonText}>
            ⏮ {SKIP_INTERVAL}s
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSeekBackward}
          >
            <ThemedText style={styles.controlButtonText}>
              ⏮ {SEEK_INTERVAL}s
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.controlButtonPrimary,
              isPlaying && styles.controlButtonActive,
            ]}
            onPress={handlePlayPause}
          >
            <ThemedText style={styles.controlButtonText}>
              {isPlaying ? "⏸" : "▶"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSeekForward}
          >
            <ThemedText style={styles.controlButtonText}>
              {SEEK_INTERVAL}s ⏭
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSkipForward}
          >
            <ThemedText style={styles.controlButtonText}>
              {SKIP_INTERVAL}s ⏭
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.controlButtonSecondary,
              isMuted && styles.controlButtonActive,
            ]}
            onPress={handleToggleMute}
          >
            <ThemedText style={styles.controlButtonText}>
              {isMuted ? "🔇" : "🔊"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Stream Selector */}
      <ThemedView style={styles.streamSelectorContainer}>
        <ThemedText type="defaultSemiBold" style={styles.streamSelectorTitle}>
          Select Video Stream:
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.streamScrollView}
        >
          {VIDEO_STREAMS.map((stream, index) => (
            <TouchableOpacity
              key={stream.id}
              style={[
                styles.streamButton,
                index === currentStreamIndex && styles.streamButtonActive,
              ]}
              onPress={() => handleSwitchStream(index)}
            >
              <ThemedText
                style={[
                  styles.streamButtonText,
                  index === currentStreamIndex && styles.streamButtonTextActive,
                ]}
              >
                {stream.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Header Info */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {currentStream.name}
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          HLS Video Streaming with custom controls, seek, skip, mute, and
          multi-stream support.
        </ThemedText>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: "#000",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    zIndex: 10,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  customControlsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  controlButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
   
  },
  controlButtonPrimary: {
    backgroundColor: "#007AFF",
    minWidth: 100,
  },
  controlButtonSecondary: {
    backgroundColor: "#5856D6",
  },
  controlButtonActive: {
    backgroundColor: "#FF9500",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  timeContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  streamSelectorContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  streamSelectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  streamScrollView: {
    flexGrow: 0,
  },
  streamButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  streamButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#0051D5",
  },
  streamButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  streamButtonTextActive: {
    color: "#FFFFFF",
  },
});
