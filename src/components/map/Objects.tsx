import React from "react";
import { G, Path, Ellipse } from "react-native-svg";

interface ObjectsProps {
  handleObjectTouch: (id: string) => void;
}

const Objects = ({ handleObjectTouch }: ObjectsProps) => {
  return (
    <G id="Objects" fill="#d8d8d8" stroke="black">
      <Path 
        d="M-0.001 -1.43H229.999V3508.57H-0.001z" 
        onPressIn={() => handleObjectTouch("Object1")} 
      />

      <Path 
        d="M3.777 0H6013.777V230H3.777z" 
        onPressIn={() => handleObjectTouch("Object2")} 
      />

      <Path 
        d="M7010 513.523H7240V3113.523H7010z" 
        onPressIn={() => handleObjectTouch("Object3")} 
      />

      <Path 
        d="M6470 508.524H7240V738.524H6470z" 
        onPressIn={() => handleObjectTouch("Object4")} 
      />

      <Path 
        d="M6470 2885.52H7240V3115.52H6470z" 
        onPressIn={() => handleObjectTouch("Object5")} 
      />

      <Path 
        d="M3.777 3280H6703.777V3510H3.777z" 
        onPressIn={() => handleObjectTouch("Object6")} 
      />

      <Path 
        d="M6468.51 2880.34H6710.209V3506.241H6468.51z" 
        onPressIn={() => handleObjectTouch("Object7")} 
      />

      <Path 
        d="M6468.51 0H6698.51V737.042H6468.51z" 
        onPressIn={() => handleObjectTouch("Object8")} 
      />

      <Path 
        d="M6451.11 903.195H6919.072999999999V1406.255H6451.11z" 
        onPressIn={() => handleObjectTouch("Object9")} 
      />

      <Path 
        d="M6456.96 2248.59H6924.923V2751.65H6456.96z" 
        onPressIn={() => handleObjectTouch("Object10")} 
      />

      <Path 
        d="M4105.45 236.348H5351.4V2636.348H4105.45z" 
        onPressIn={() => handleObjectTouch("Object11")} 
      />

      <Path 
        d="M238.909 873.947H876.508V2640.507H238.909z" 
        onPressIn={() => handleObjectTouch("Object12")} 
      />

      <Ellipse 
        cx={3233.3} 
        cy={886.022} 
        rx={529.383} 
        ry={529.383} 
        fill="gray" 
      />

      <Path 
        d="M2496.83 1705.03H4111.3V2635.105H2496.83z" 
        onPressIn={() => handleObjectTouch("Object13")} 
      />
    </G>
  );
}

export default Objects;