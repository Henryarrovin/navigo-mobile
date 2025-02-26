import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import PathMarkerSvg from "@/assets/maps/location-pointer.svg";
import MapBackground from "./map/MapBackground";
import Objects from "./map/Objects";
import Paths from "./map/Paths";
import Positions from "./map/Positions";
import NavigationContext from "@/app/contexts/NavigationContext";
import MapDataContext from "@/app/contexts/MapDataContext";
import graphData from "@/app/store/graphData";

const IndoorMapWrapper = () => {
  const { navigation, setNavigation, isEditMode } = useContext(NavigationContext);
  const { objects } = useContext(MapDataContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const startVertex = graphData.vertices.find((v) => v.id === navigation.start);

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
    <GestureHandlerRootView className="flex-1">
      <GestureDetector gesture={combinedGesture}>
        <View className="flex-1 items-center justify-center">
          <Animated.View style={animatedStyle}>
            <MapBackground>
              <Objects handleObjectTouch={(obj) => { setSelectedObject(obj); setModalOpen(true); }} />
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
       {/* <ObjectDetailsModal open={modalOpen} object={selectedObject} onClose={() => setModalOpen(false)} /> */}
    </GestureHandlerRootView>
  );
};

export default IndoorMapWrapper;