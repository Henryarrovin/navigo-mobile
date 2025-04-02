import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '@/services/apiService';

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
  zonesError: null
};

export const fetchZones = createAsyncThunk<Zone[]>(
  'map/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/map/zones');
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
      const response = await apiService.post('/map/path', { start, end });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to find path');
    }
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
        state.zonesError = action.payload as string || 'Failed to fetch zones';
      })

      // Find Path
      .addCase(findPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findPath.fulfilled, (state, action) => {
        state.loading = false;
        state.path = action.payload.path.map(point => point.exitPoint);
        state.distance = action.payload.distance;
      })
      .addCase(findPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to find path';
      });
  },
});

export const { setProductPosition, resetMapState, setUserPosition } = mapSlice.actions;
export default mapSlice.reducer;
