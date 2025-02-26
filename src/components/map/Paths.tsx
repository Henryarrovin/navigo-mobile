import graphData from "@/app/store/graphData";
import React from "react";
import { Path, G } from "react-native-svg";

const Paths = () => {
  return (
    <G id="Edges">
      {graphData.edges.map((edge) => {
        const { id, from, to } = edge;
        const fromVertex = graphData.vertices.find(
          (vertex) => vertex.id === from
        );
        const toVertex = graphData.vertices.find((vertex) => vertex.id === to);

        if (fromVertex && toVertex) {
          const pathD = `M${fromVertex.cx} ${fromVertex.cy} L${toVertex.cx} ${toVertex.cy}`;
          return <Path key={id} id={id} d={pathD} stroke="black" strokeWidth={2} />;
        }
        return null;
      })}
    </G>
  );
}

export default Paths;