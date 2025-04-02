import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { fetchZones, findPath, resetMapState, setProductPosition, setUserPosition } from '../features/mapSlice';
import { PathPoint } from '../types/mapTypes';


const useMap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    zones,
    userPosition,
    productPosition,
    path,
    distance,
    loading,
    error,
    zonesLoading,
    zonesError
  } = useSelector(( state: RootState ) => state.map);

  // Load zones on mount
  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  // Reset map state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetMapState());
    };
  }, [dispatch]);

  const findPathToProduct = useCallback((end: PathPoint) => {
    if (!userPosition) return;
    
    dispatch(setProductPosition(end));
    dispatch(findPath({ 
      start: userPosition, 
      end 
    }));
  }, [dispatch, userPosition]);

  const updateUserPosition = useCallback((position: PathPoint) => {
    dispatch(setUserPosition(position));
  }, [dispatch]);

  const getZoneNameAtPosition = useCallback((position: PathPoint): string => {
    const zone = zones.find(z => 
      z.vertices.length >= 3 && 
      pointInPolygon(position, z.vertices.map(v => ({ x: v.x, y: v.y })))
    );
    return zone?.name || 'Unknown Zone';
  }, [zones]);

  const pointInPolygon = (point: PathPoint, polygon: PathPoint[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const calculateDistance = (point1: PathPoint, point2: PathPoint): number => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  return {
    // State
    zones,
    userPosition,
    productPosition,
    path,
    distance,
    loading,
    error,
    zonesLoading,
    zonesError,
    
    // Actions
    findPathToProduct,
    updateUserPosition,
    resetMap: () => dispatch(resetMapState()),
    reloadZones: () => dispatch(fetchZones()),
    
    // Utilities
    getZoneNameAtPosition,
    calculateDistance,
    pointInPolygon
  };
};

export default useMap;
