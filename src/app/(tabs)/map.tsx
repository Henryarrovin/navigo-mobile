import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import IndoorMapWrapper from "@/components/IndoorMapWrapper";
import NavigationContext from "../contexts/NavigationContext";
import MapDataContext from "../contexts/MapDataContext";

const MapScreen = () => {
  const { navigation } = useContext(NavigationContext);
  const { objects } = useContext(MapDataContext);
  
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => { scale.value = event.scale; })
    .onEnd(() => { scale.value = withTiming(Math.max(1, Math.min(scale.value, 3))); });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
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
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={[animatedStyle, { flex: 1 }]}>
            <IndoorMapWrapper />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );  
};

export default MapScreen;