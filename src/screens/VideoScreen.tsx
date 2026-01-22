import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio

// HLS Test Stream URL (publicly available)
const HLS_STREAM_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function VideoScreen() {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
      // Only show loading when actually loading/buffering AND not playing yet
      // Once video starts playing, hide loading overlay even if buffering
      setIsLoading(playbackStatus.isBuffering && !playbackStatus.isPlaying);
    } else {
      // Video is still loading
      setIsLoading(true);
      // Handle loading state errors
      if (!playbackStatus.isLoaded && 'error' in playbackStatus) {
        const errorMessage = typeof playbackStatus.error === 'string' 
          ? playbackStatus.error 
          : 'Failed to load video';
        setError(`Failed to load video: ${errorMessage}`);
        Alert.alert('Load Error', errorMessage);
        setIsLoading(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;
    await videoRef.current.replayAsync();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Video Player
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          HLS Streaming Video Playback
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.videoContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: HLS_STREAM_URL,
          }}
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoadStart={() => {
            setIsLoading(true);
            setError(null);
          }}
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={(error: any) => {
            const errorMessage = typeof error === 'string' 
              ? error 
              : (error?.message || error?.toString() || 'Unknown error');
            setError(`Video error: ${errorMessage}`);
            setIsLoading(false);
            Alert.alert('Video Error', errorMessage);
          }}
        />
      </ThemedView>

      <ThemedView style={styles.controlsContainer}>
        <ThemedView
          style={[styles.controlButton, isPlaying && styles.controlButtonActive]}
          onTouchEnd={handlePlayPause}>
          <ThemedText style={styles.controlButtonText}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </ThemedText>
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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    zIndex: 10,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  infoContainer: {
    padding: 20,
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  controlButtonActive: {
    backgroundColor: '#FF9500',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
