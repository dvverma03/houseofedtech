/**
 * Type definition for homepage section data
 */
export interface HomepageDataItem {
  id: number;
  title: string;
  sliderText: string;
  sectionImage: string;
  successMessage?: string;
  onSlideAction: () => void | Promise<void>;
}

/**
 * Homepage sections configuration
 * This data drives the dynamic rendering of sections on the home screen
 */
export const createHomepageData = (
  navigateToWebView: () => void,
  navigateToVideo: () => void,
  handleTestNotification: () => Promise<void>,
): HomepageDataItem[] => [
  {
    id: 1,
    title: "WebView",
    sliderText: "Swipe to open Webview",
    sectionImage:
      "https://cdn.dribbble.com/userupload/6428123/file/original-aab84503fd846a3ca140ea0c2f09e6a7.png?crop=0x0-2395x1800&format=webp&resize=400x300&vertical=center",
    successMessage: "Swiped Successfully!",
    onSlideAction: navigateToWebView,
  },
  {
    id: 2,
    title: "HLS Video Streaming",
    sliderText: "Swipe to Play Video",
    sectionImage: "https://flutterx.com/thumbnails/artifact-2982.jpeg",
    successMessage: "Swiped Successfully!",
    onSlideAction: navigateToVideo,
  },
  {
    id: 3,
    title: "Smart Notifications",
    sliderText: "Swipe to Test Notification",
    sectionImage:
      "https://img.freepik.com/premium-vector/push-notifications-concept-illustration_114360-4730.jpg?semt=ais_hybrid&w=740&q=80",
    successMessage: "Swiped Successfully!",
    onSlideAction: handleTestNotification,
  },
];
