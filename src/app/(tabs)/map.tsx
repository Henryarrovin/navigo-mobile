import { View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import MapSvg from "../../../src/assets/maps/map_layout.svg";
import PathMarkerSvg from "../../../src/assets/maps/location-pointer.svg";

const MapScreen = () => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(Math.max(1, Math.min(scale.value, 3)));
    });

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

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ] as const,
  }));

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <GestureDetector gesture={combinedGesture}>
        <View className="flex-1 items-center justify-center">
          <Animated.View style={animatedContainerStyle}>
            <MapSvg width={400} height={600} />
            <View style={{ position: "absolute", top: 200, left: 150 }}>
              <PathMarkerSvg width={40} height={40} />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export default MapScreen;