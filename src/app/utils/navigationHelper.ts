import { Dispatch, SetStateAction } from "react";
import { Navigation, NavigationContextType } from "./types";
import { ObjectItem } from "./types";
import Toast from "react-native-toast-message";
import graphData from "../store/graphData";
import { graph } from "@/algorithms/dijkstra";

export let routeLength = 0;

const findVertexByObjectId = (vertexId: string) =>
  graphData.vertices.find((v) => v.objectName === vertexId);

export function navigateToObject(
  selectedObjectId: string,
  navigation: NavigationContextType["navigation"],
  setNavigation: NavigationContextType["setNavigation"]
) {
  const target = findVertexByObjectId(selectedObjectId);
  if (!target) {
    console.error("Target not found");
    Toast.show({
      type: "error",
      text1: "Navigation Error",
      text2: "Target not found",
    });
    return;
  }

  const shortestPath = graph.calculateShortestPath(navigation.start, target.id);

  if (shortestPath.length === 0) {
    Toast.show({
      type: "error",
      text1: "Navigation Error",
      text2: "No valid path found!",
    });
    return;
  }

  setNavigation((prevNavigation) => ({
    ...prevNavigation,
    end: selectedObjectId,
    path: shortestPath,
  }));
}

export function resetEdges() {
  graphData.edges.forEach((edge) => {
    const element = document.getElementById(edge.id);
    if (element) {
      element.classList.remove("path-active");
    }
  });
}

export function navigateWithDelay(
  objects: ObjectItem[],
  index: number,
  delay: number,
  navigation: Navigation,
  setNavigation: Dispatch<SetStateAction<Navigation>>
) {
  if (index < objects.length) {
    const obj = objects[index];
    navigateToObject(obj.name, navigation, setNavigation);

    setTimeout(() => {
      navigateWithDelay(objects, index + 1, delay, navigation, setNavigation);
    }, delay);
  }
}