// Type definitions for the application

export interface NotificationData {
  screen?: string;
  action?: string;
  [key: string]: any;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WebViewState {
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface SliderComponentProps {
  onSwipeComplete: () => void;
  text: string;
  successMessage?: string;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  swipeThreshold?: number;
  resetDelay?: number;
}