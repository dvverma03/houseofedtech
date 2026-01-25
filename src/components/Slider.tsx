import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SliderComponentProps } from "../types";

const { width: screenWidth } = Dimensions.get("window");

const Slider: React.FC<SliderComponentProps> = ({
  onSwipeComplete,
  text,
  successMessage: externalSuccessMessage,
  disabled = false,
  backgroundColor = "#b40ff5",
  textColor = "white",
  swipeThreshold = 0.6,
  resetDelay = 2000,
}) => {
  // Shared values for smooth animations (run on UI thread)
  const translateX = useSharedValue(0);
  const arrowTranslateX = useSharedValue(0);
  const backgroundColorProgress = useSharedValue(0);
  const isSwipeInProgressShared = useSharedValue(false);
  const disabledShared = useSharedValue(disabled);
  const maxTranslateX = useSharedValue(screenWidth * 0.92 - 80); // 92% of screen width minus handle width
  // Threshold is based on slider width (maxTranslateX), not screen width
  const threshold = useSharedValue((screenWidth * 0.92 - 80) * swipeThreshold);

  // Local state
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);
  const [internalSuccessMessage, setInternalSuccessMessage] = useState<
    string | null
  >(null);

  // Use external success message if provided, otherwise use internal
  const displaySuccessMessage =
    externalSuccessMessage || internalSuccessMessage;

  // Store backgroundColor as constant (can be used in worklets)
  const backgroundColorValue = backgroundColor;

  // Update shared values when props/state change
  useEffect(() => {
    disabledShared.value = disabled;
    isSwipeInProgressShared.value = isSwipeInProgress;
    const maxX = screenWidth * 0.92 - 80;
    maxTranslateX.value = maxX;
    // Threshold is based on slider width (maxTranslateX), not screen width
    threshold.value = maxX * swipeThreshold;
  }, [disabled, isSwipeInProgress, swipeThreshold]);

  // Function to start arrow animation
  const startArrowAnimation = () => {
    "worklet";
    if (disabledShared.value || isSwipeInProgressShared.value) return;

    arrowTranslateX.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 500 }),
        withTiming(0, { duration: 500 }),
      ),
      -1, // infinite loop
      false,
    );
  };

  // Arrow animation - runs continuously when not disabled/in progress
  useEffect(() => {
    if (disabled || isSwipeInProgress) return;

    startArrowAnimation();

    return () => {
      cancelAnimation(arrowTranslateX);
    };
  }, [disabled, isSwipeInProgress]);

  // Handle swipe completion callback
  const handleSwipeComplete = () => {
    if (isSwipeInProgress || disabled) {
      __DEV__ && console.log("Swipe already in progress or disabled, ignoring");
      return;
    }

    setIsSwipeInProgress(true);
    isSwipeInProgressShared.value = true;
    setInternalSuccessMessage("Processing...");

    // Animate background color to green
    backgroundColorProgress.value = withTiming(1, { duration: 200 });

    // Call the provided callback function
    onSwipeComplete();

    // Reset after delay
    setTimeout(() => {
      setInternalSuccessMessage(null);
      setIsSwipeInProgress(false);
      isSwipeInProgressShared.value = false;

      // Reset animations
      translateX.value = withTiming(0, { duration: 200 });
      backgroundColorProgress.value = withTiming(0, { duration: 200 }, () => {
        // Restart arrow animation after reset
        "worklet";
        startArrowAnimation();
      });
    }, resetDelay);
  };

  // Pan gesture handler - following the example pattern
  const pan = Gesture.Pan()
    .enabled(!disabled && !isSwipeInProgress)
    .onStart(() => {
      "worklet";
      // Stop arrow animation when user starts touching
      cancelAnimation(arrowTranslateX);
    })
    .onChange((event) => {
      "worklet";
      if (disabledShared.value || isSwipeInProgressShared.value) return;

      // Only allow movement to the right and within bounds
      const maxX = maxTranslateX.value;
      const newValue = Math.max(0, Math.min(event.translationX, maxX));
      translateX.value = newValue;

      // Update background color progress during swipe
      backgroundColorProgress.value = newValue / maxX;
    })
    .onEnd((event) => {
      "worklet";
      if (disabledShared.value || isSwipeInProgressShared.value) {
        translateX.value = withTiming(0, { duration: 200 });
        backgroundColorProgress.value = withTiming(0, { duration: 200 }, () => {
          // Restart arrow animation after slider returns to start
          startArrowAnimation();
        });
        return;
      }

      const thresholdValue = threshold.value;
      const maxX = maxTranslateX.value;

      if (event.translationX > thresholdValue) {
        // Swipe completed - animate to end and trigger callback
        translateX.value = withTiming(maxX, { duration: 200 });
        runOnJS(handleSwipeComplete)();
      } else {
        // Swipe not far enough - animate back to start
        translateX.value = withTiming(0, { duration: 200 });
        backgroundColorProgress.value = withTiming(0, { duration: 200 }, () => {
          // Restart arrow animation after slider returns to start
          startArrowAnimation();
        });
      }
    });

  // Animated styles
  const swipeImageContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: arrowTranslateX.value }],
    };
  });

  const swipeButtonStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      backgroundColorProgress.value,
      [0, 1],
      [backgroundColorValue, "green"],
    );
    return {
      backgroundColor: bgColor,
    };
  });

  const textOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, 200], [1, 0], "clamp");
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.swipeButton, swipeButtonStyle]}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.swipeImageContainer, swipeImageContainerStyle]}
        >
          <Animated.View style={arrowStyle}>
            <Image
              source={require("../assets/images/swipeIcon.png")}
              style={styles.swipeImage}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <View>
        <Animated.Text
          style={[
            styles.swipeButtonText,

            { color: textColor, fontWeight: "600", fontSize: 16 },
            textOpacityStyle,
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeButton: {
    height: 56,
    borderRadius: 35,
    flexDirection: "row",
    maxWidth: "92%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    alignSelf: "center",
  },
  swipeImageContainer: {
    position: "absolute",
    left: 0,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeImage: {
    height: 43,
    width: 43,
    objectFit: "contain",
    marginLeft: 2,
  },
  swipeButtonText: {
    marginLeft: 20,
  },
});

export default Slider;
