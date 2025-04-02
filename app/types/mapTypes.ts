export interface Zone {
  _id: string;
  name: string;
  floor: number;
  vertices: { x: number; y: number; _id: string }[];
  isNavigable: boolean;
  adjacentZones: {
    connectionPoints: {
      from: { x: number; y: number };
      to: { x: number; y: number };
    };
    zone: string;
    _id: string;
  }[];
  svgPath: string;
  __v: number;
}

export interface PathPoint {
  x: number;
  y: number;
}

export interface MapState {
  zones: Zone[];
  userPosition: PathPoint;
  productPosition: PathPoint | null;
  path: PathPoint[];
  loading: boolean;
  error: string | null;
  distance: number | null;
}