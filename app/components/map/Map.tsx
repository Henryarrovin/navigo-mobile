import React, { useEffect, useMemo } from 'react';
import { 
  Dimensions, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import Svg, { Path, Line, G, Circle, Polyline } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import useMap from '@/app/hooks/useMap';
import usePdr from '@/app/hooks/usePdr';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/features/store';

const Map = () => {
  const params = useLocalSearchParams();
  const { width } = Dimensions.get('window');
  const svgWidth = width - 40;
  const svgHeight = (svgWidth * 600) / 800;
  const gridSize = 50;

  const { startPdrTracking, stopPdrTracking } = usePdr();
  const pdrData = useSelector((state: RootState) => state.map.pdrData);
  const isTracking = useSelector((state: RootState) => state.map.isTracking);

  const {
    zones,
    userPosition,
    productPosition,
    path,
    distance,
    loading,
    error,
    zonesLoading,
    findPathToProduct,
    getZoneNameAtPosition,
    calculateDistance,
    resetMap,
    reloadZones
  } = useMap();

  const getZoneColor = (name: string) => {
    switch(name) {
      case 'Main Hall': return '#e1f5fe';
      case 'Room A': return '#e8f5e9';
      case 'Room B': return '#fff3e0';
      default: return '#f5f5f5';
    }
  };

  const getZoneStrokeColor = (name: string) => {
    switch(name) {
      case 'Main Hall': return '#0288d1';
      case 'Room A': return '#388e3c';
      case 'Room B': return '#fb8c00';
      default: return '#9e9e9e';
    }
  };

  // Set product position from params when component mounts
  useEffect(() => {
    if (params.x && params.y) {
      const position = {
        x: typeof params.x === 'string' ? parseFloat(params.x) : 0,
        y: typeof params.y === 'string' ? parseFloat(params.y) : 0
      };
      findPathToProduct(position);
    }

    return () => {
      resetMap();
      stopPdrTracking(); // Cleanup tracking when component unmounts
    };
  }, [params.x, params.y]);

  const renderGrid = () => {
    const gridLines = [];
    const gridLabels = [];
  
    // Horizontal lines and Y-axis labels
    for (let y = 0; y <= 600; y += gridSize) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          x1="0"
          y1={y}
          x2="800"
          y2={y}
          stroke="#ccc"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      );
  
      if (y > 0) {
        gridLabels.push(
          <Text 
            key={`y-${y}`} 
            style={[styles.gridLabel, { 
              top: (y / 600) * svgHeight - 8, 
              color: '#0288d1',
            }]}
          >
            {y}
          </Text>
        );
      }
    }
  
    // Vertical lines and X-axis labels
    for (let x = 0; x <= 800; x += gridSize) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="600"
          stroke="#ccc"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      );
  
      if (x > 0) {
        gridLabels.push(
          <Text 
            key={`x-${x}`} 
            style={[styles.gridLabel, { 
              left: (x / 800) * svgWidth - 15, 
              top: 5, 
              color: '#fb8c00' 
            }]}
          >
            {x}
          </Text>
        );
      }
    }
  
    return (
      <G>
        {gridLines}
        {gridLabels}
      </G>
    );
  };

  const renderZones = useMemo(() => {
    return zones.map(zone => (
      <Path
        key={zone._id}
        d={zone.svgPath}
        fill={getZoneColor(zone.name)}
        stroke={getZoneStrokeColor(zone.name)}
        strokeWidth="2"
      />
    ));
  }, [zones]);

  const renderConnections = useMemo(() => {
    return zones.flatMap(zone => 
      zone.adjacentZones.map(connection => (
        <Line
          key={`${zone._id}-${connection.zone}`}
          x1={connection.connectionPoints.from.x}
          y1={connection.connectionPoints.from.y}
          x2={connection.connectionPoints.to.x}
          y2={connection.connectionPoints.to.y}
          stroke="#000"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
      ))
    );
  }, [zones]);

  const currentZoneName = userPosition ? getZoneNameAtPosition(userPosition) : 'Unknown';
  const productZoneName = productPosition ? getZoneNameAtPosition(productPosition) : 'Unknown';

  if (zonesLoading) {
    return (
      <View style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button 
          title={isTracking ? "Stop Tracking" : "Start Tracking"}
          onPress={() => isTracking ? stopPdrTracking() : startPdrTracking()}
          color={isTracking ? "#ff4444" : "#4CAF50"}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.mapWrapper}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Finding path...</Text>
            </View>
          )}
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => productPosition ? findPathToProduct(productPosition) : reloadZones()}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          
          <Svg width={svgWidth} height={svgHeight} viewBox="0 0 800 600">
            {renderGrid()}
            {renderZones}
            {renderConnections}
            
            {/* Path */}
            {path.length > 0 && (
              <Polyline
                points={path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#6200ee"
                strokeWidth="4"
                strokeDasharray="10,5"
              />
            )}
            
            {/* User Marker */}
            <G>
              {/* Direction Arrow */}
              <Path
                d="M-10,-15 L0,-25 L10,-15 Z"
                fill="#6200ee"
                transform={`
                  translate(${userPosition.x}, ${userPosition.y})
                  rotate(${pdrData.heading || 0})
                `}
              />
              {/* User Position Circle */}
              <Circle
                cx={userPosition.x}
                cy={userPosition.y}
                r="12"
                fill="#6200ee"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </G>
            
            {/* Product Marker */}
            {productPosition && (
              <Circle
                cx={productPosition.x}
                cy={productPosition.y}
                r="10"
                fill="#ff0000"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
          </Svg>
          
          <View style={styles.infoContainer}>
            <View style={styles.positionInfo}>
              <Text style={styles.infoTitle}>Current Position</Text>
              <Text style={styles.infoText}>
                X: {userPosition.x}, Y: {userPosition.y}
              </Text>
              <Text style={styles.infoText}>Zone: {currentZoneName}</Text>
            </View>

            {productPosition && (
              <View style={styles.positionInfo}>
                <Text style={styles.infoTitle}>Product Location</Text>
                <Text style={styles.infoText}>
                  X: {productPosition.x}, Y: {productPosition.y}
                </Text>
                <Text style={styles.infoText}>Zone: {productZoneName}</Text>
                {distance !== null && (
                  <Text style={styles.infoText}>
                    Distance: {Math.round(distance)} units
                  </Text>
                )}
              </View>
            )}

            {isTracking && (
              <View style={styles.positionInfo}>
                <Text style={styles.infoTitle}>PDR Data</Text>
                <Text style={styles.infoText}>Steps: {pdrData.stepCount}</Text>
                <Text style={styles.infoText}>Heading: {pdrData.heading.toFixed(1)}°</Text>
                <Text style={styles.infoText}>Step Length: {pdrData.stepLength.toFixed(2)}m</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4D4D4',
    paddingTop: 20,
    paddingBottom: 20,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4D4D4',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  gridLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  infoContainer: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  positionInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    minWidth: '48%',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 8,
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    padding: 8,
  },
});

export default Map;
