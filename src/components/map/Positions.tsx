import React from "react";
import { Circle, G } from "react-native-svg";
import graphData from "@/app/store/graphData";
import { NavigationContextType } from "@/app/utils/types";

interface PositionsProps {
  positionRadius: number;
  handlePositionTouch: (id: string) => void;
  navigation?: NavigationContextType["navigation"];
}

function Positions({ positionRadius, handlePositionTouch, navigation }: PositionsProps) {
  const startVertex = graphData.vertices.find((v) => v.id === navigation?.start);

  return (
    <G id="Vertexes">
      {graphData.vertices.map((vertex) => (
        <Circle
          key={vertex.id}
          id={vertex.id}
          cx={vertex.cx}
          cy={vertex.cy}
          r={positionRadius}
          fill={vertex.objectName ? "transparent" : "blue"}
          opacity={vertex.objectName ? 0 : 1}
          onPressIn={() => !vertex.objectName && handlePositionTouch(vertex.id)}
        />
      ))}

      {/* Background circle for highlighting start position */}
      {startVertex && (
        <Circle
          cx={startVertex.cx}
          cy={startVertex.cy}
          r={positionRadius + 7}
          fill="blue"
          opacity={0.2}
        />
      )}
    </G>
  );
}

export default Positions;