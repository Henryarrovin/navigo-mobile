import MapDataContext from "@/app/contexts/MapDataContext";
import NavigationContext from "@/app/contexts/NavigationContext";
import graphData from "@/app/store/graphData";
import PathMarkerSvg from "@/assets/maps/location-pointer.svg";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import MapBackground from "./map/MapBackground";
import Objects from "./map/Objects";
import Paths from "./map/Paths";
import Positions from "./map/Positions";
import { navigateToObject } from "@/app/utils/navigationHelper";

const { width, height } = Dimensions.get("window");

const IndoorMapWrapper = () => {
  const { navigation, setNavigation } = useContext(NavigationContext);
  const { objects } = useContext(MapDataContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const startVertex = graphData.vertices.find((v) => v.id === navigation.start);

  const scale = useSharedValue(2);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const maxScale = 3;
  const minScale = 1;
  const maxTranslateX = width / 2;
  const maxTranslateY = height / 2;
  const minTranslateX = -width / 2;
  const minTranslateY = -height / 2;

  useEffect(() => {
    if (startVertex) {
      translateX.value = withTiming(Math.max(minTranslateX, Math.min(maxTranslateX, -startVertex.cx + width / 2)));
      translateY.value = withTiming(Math.max(minTranslateY, Math.min(maxTranslateY, -startVertex.cy + height / 2)));
    }
  }, [navigation.start]);

  const handleObjectTouch = useCallback((obj) => {
    setSelectedObject(obj);
    setModalOpen(true);
    navigateToObject(obj.name, navigation, setNavigation);
  }, [navigation, setNavigation]);

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
    <GestureHandlerRootView className="flex-1 justify-center items-center">
      <GestureDetector gesture={combinedGesture}>
        <View className="flex-1 items-center justify-center">
          <Animated.View style={animatedStyle}>
            <MapBackground>
              <Objects handleObjectTouch={handleObjectTouch} />
              <Paths />
              <Positions
                positionRadius={10}
                handlePositionTouch={(id) => setNavigation({ start: id, end: "" })}
                navigation={navigation}
              />
            </MapBackground>

            {startVertex ? (
              <View
                style={{
                  position: "absolute",
                  left: startVertex.cx - 20,
                  top: startVertex.cy - 40,
                }}
              >
                <PathMarkerSvg width={40} height={40} />
              </View>
            ) : (
              <View>
                <Text>Start position not found</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default IndoorMapWrapper;