import apiService from '@/services/apiService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { calculateNewPosition } from '../utils/pdrCalculations';
import { RootState } from './store';

interface PathPoint {
  x: number;
  y: number;
}

interface Zone {
  _id: string;
  name: string;
  floor: number;
  vertices: { x: number; y: number; _id: string }[];
  isNavigable: boolean;
  adjacentZones: {
    connectionPoints: {
      from: PathPoint;
      to: PathPoint;
    };
    zone: string;
    _id: string;
  }[];
  svgPath: string;
  __v: number;
}

interface PathResponse {
  path: {
    zone: Zone;
    entryPoint: PathPoint;
    exitPoint: PathPoint;
  }[];
  distance: number;
}

interface PathRecalculationResponse {
  path: PathPoint[];
  distance: number;
}

interface MapState {
  zones: Zone[];
  userPosition: PathPoint;
  productPosition: PathPoint | null;
  path: PathPoint[];
  loading: boolean;
  error: string | null;
  distance: number | null;
  zonesLoading: boolean;
  zonesError: string | null;

  isTracking: boolean;
  pdrData: {
    stepCount: number;
    stepLength: number;
    heading: number;
  };
}

const initialState: MapState = {
  zones: [],
  userPosition: { x: 600, y: 350 },
  productPosition: null,
  path: [],
  loading: false,
  error: null,
  distance: null,
  zonesLoading: false,
  zonesError: null,

  isTracking: false,
  pdrData: {
    stepCount: 0,
    stepLength: 0.7, // Average step length in meters
    // stepLength: 1.5,
    heading: 0, // in degrees
  },
};

export const fetchZones = createAsyncThunk<Zone[]>(
  'map/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<Zone[]>('/map/zones');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch zones');
    }
  }
);

export const findPath = createAsyncThunk<PathResponse, { start: PathPoint; end: PathPoint }>(
  'map/findPath',
  async ({ start, end }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<PathResponse>('/map/path', { start, end });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to find path');
    }
  }
);

// for path recalculation
export const updatePositionAndRecalculate = createAsyncThunk(
  'map/updatePositionAndRecalculate',
  async ({ newPosition, zones }: { newPosition: PathPoint; zones: Zone[] }, { getState, dispatch }) => {
    dispatch(setUserPosition(newPosition)); // Changed from updateUserPosition to setUserPosition

    const state = getState() as RootState;
    if (state.map.productPosition) {
      try {
        const lastPathPoint = state.map.path[state.map.path.length - 1];
        const distanceFromLastPathPoint = lastPathPoint
          ? Math.sqrt(
              Math.pow(newPosition.x - lastPathPoint.x, 2) +
              Math.pow(newPosition.y - lastPathPoint.y, 2)
            )
          : Infinity;

        const currentZone = getCurrentZone(state.map.userPosition, zones);
        const currentZoneVertices = currentZone?.vertices?.map(v => ({ x: v.x, y: v.y })) || [];

        if (
          distanceFromLastPathPoint > 50 ||
          !pointInPolygon(newPosition, currentZoneVertices)
        ) {
          const response = await apiService.post('/map/path', {
            start: newPosition,
            end: state.map.productPosition,
            zones,
          });
          return response.data;
        }
      } catch (error) {
        console.error('Path recalculation failed:', error);
        return { path: [], distance: 0 };
      }
    }
    return { path: [], distance: 0 };
  }
);

// Helper function with proper type safety
function getCurrentZone(position: PathPoint, zones: Zone[]): Zone | undefined {
  return zones.find((zone) => {
    const vertices = zone.vertices.map(v => ({ x: v.x, y: v.y }));
    return pointInPolygon(position, vertices);
  });
}

// Helper function used by the reducer
function pointInPolygon(point: PathPoint, polygon: PathPoint[]): boolean {
  if (!point || !polygon || polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Add new async thunk for PDR updates
export const updatePositionWithPdr = createAsyncThunk<
  { position: PathPoint; pathData: PathResponse | null } | null,
  { stepLength: number; heading: number }
>(
  'map/updatePositionWithPdr',
  async ({ stepLength, heading }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    // Don't proceed if not tracking
    if (!state.map.isTracking) {
      return null;
    }

    const newPosition = calculateNewPosition(
      state.map.userPosition,
      stepLength,
      heading
    );

    if (state.map.productPosition) {
      try {
        const response = await apiService.post<PathResponse>('/map/path', {
          start: newPosition,
          end: state.map.productPosition,
        });
        return {
          position: newPosition,
          pathData: response.data,
        };
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update path');
      }
    }

    return {
      position: newPosition,
      pathData: null,
    };
  }
);

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setProductPosition: (state, action: { payload: PathPoint }) => {
      state.productPosition = action.payload;
    },
    resetMapState: (state) => {
      state.path = [];
      state.distance = null;
      state.error = null;
      state.loading = false;
    },
    setUserPosition: (state, action: { payload: PathPoint }) => {
      state.userPosition = action.payload;
    },

    startTracking: (state) => {
      state.isTracking = true;
    },
    stopTracking: (state) => {
      state.isTracking = false;
      state.loading = false; // Reset loading state when stopping
      state.error = null;    // Clear any errors
    },
    updatePdrData: (
      state,
      action: PayloadAction<{
        stepCount?: number;
        stepLength?: number;
        heading?: number;
      }>
    ) => {
      state.pdrData = {
        ...state.pdrData,
        ...action.payload,
      };
    },
    updateStep: (state, action: PayloadAction<{ timestamp: number }>) => {
      if (state.isTracking) {
        state.pdrData.stepCount += 1;
      }
    },
    updateHeading: (
      state,
      action: PayloadAction<{ heading: number; timestamp: number }>
    ) => {
      if (state.isTracking) {
        state.pdrData.heading = action.payload.heading;
      }
    },
    resetPdr: (state) => {
      state.pdrData = {
        stepCount: 0,
        stepLength: 0.7,
        heading: 0,
      };
      state.isTracking = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Zones
      .addCase(fetchZones.pending, (state) => {
        state.zonesLoading = true;
        state.zonesError = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zonesLoading = false;
        state.zones = action.payload;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.zonesLoading = false;
        state.zonesError = (action.payload as string) || 'Failed to fetch zones';
      })

      // Find Path
      .addCase(findPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findPath.fulfilled, (state, action) => {
        state.loading = false;
        state.path = action.payload.path.map((point) => point.exitPoint);
        state.distance = action.payload.distance;
      })
      .addCase(findPath.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to find path';
      })

      // Handle PDR position updates
      .addCase(updatePositionWithPdr.pending, (state) => {
        // Only set loading if still tracking
        if (state.isTracking) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(updatePositionWithPdr.fulfilled, (state, action) => {
        // Only update state if still tracking
        if (state.isTracking && action.payload) {
          state.loading = false;
          state.userPosition = action.payload.position;
          if (action.payload.pathData) {
            state.path = action.payload.pathData.path.map((point) => point.exitPoint);
            state.distance = action.payload.pathData.distance;
          }
        } else {
          state.loading = false; // Ensure loading is reset
        }
      })
      .addCase(updatePositionWithPdr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update position';
      });
  },
});

export const {
  startTracking,
  stopTracking,
  updatePdrData,
  updateStep,
  updateHeading,
  resetPdr,

  setProductPosition,
  resetMapState,
  setUserPosition,
} = mapSlice.actions;
export default mapSlice.reducer;
