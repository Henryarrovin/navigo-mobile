import React, { useContext, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import IndoorMapWrapper from "@/components/IndoorMapWrapper";
import NavigationContext from "../contexts/NavigationContext";
import MapDataContext from "../contexts/MapDataContext";

const { width, height } = Dimensions.get("window");

const MapScreen = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const maxScale = 3;
  const minScale = 1;
  const maxTranslateX = width / 2;
  const maxTranslateY = height / 2;
  const minTranslateX = -width / 2;
  const minTranslateY = -height / 2;

  useEffect(() => {
    translateX.value = withTiming(Math.max(minTranslateX, Math.min(maxTranslateX, 0)));
    translateY.value = withTiming(Math.max(minTranslateY, Math.min(maxTranslateY, 0)));
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => { scale.value = event.scale; })
    .onEnd(() => { scale.value = withTiming(Math.max(minScale, Math.min(scale.value, maxScale)), { duration: 500 }); });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(minTranslateX, Math.min(maxTranslateX, translateX.value + event.translationX / 4));
      translateY.value = Math.max(minTranslateY, Math.min(maxTranslateY, translateY.value + event.translationY / 4));
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value, { damping: 30 });
      translateY.value = withSpring(translateY.value, { damping: 30 });
    });

  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ] as const,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[animatedStyle, { flex: 1 }]}>
          <IndoorMapWrapper />
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default MapScreen;