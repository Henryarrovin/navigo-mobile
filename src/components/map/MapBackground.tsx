import React, { ReactNode } from "react";
import Svg from "react-native-svg";
import Floorplan from "@/assets/maps/map_layout.svg";

interface MapBackgroundProps {
  children: ReactNode;
}

const MapBackground = ({ children }: MapBackgroundProps) => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 7240 3510" pointerEvents="box-none">
      <Floorplan width="100%" height="100%" />
      {children}
    </Svg>
  );
};

export default MapBackground;