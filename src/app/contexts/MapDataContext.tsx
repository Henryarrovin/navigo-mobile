import { createContext, useState, ReactNode } from "react";

export type MapDataContextType = {
  objects: any[];
  setObjects: (objects: any[]) => void;
};

const MapDataContext = createContext<MapDataContextType | null>(null);

export const MapDataProvider = ({ children }: { children: ReactNode }) => {
  const [objects, setObjects] = useState([]);

  return <MapDataContext.Provider value={{ objects, setObjects }}>{children}</MapDataContext.Provider>;
};

export default MapDataContext;