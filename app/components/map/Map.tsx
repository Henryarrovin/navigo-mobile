import React, { useEffect, useMemo, useState } from 'react';
import { 
  Dimensions, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Svg, { Path, Line, G, Circle, Polyline } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import useMap from '@/app/hooks/useMap';
import usePdr from '@/app/hooks/usePdr';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/features/store';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setUserPosition } from '@/app/features/mapSlice';
import Celebration from '../Celebration';

const Map = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const { width } = Dimensions.get('window');
  const svgWidth = width - 40;
  const svgHeight = (svgWidth * 600) / 800;
  const gridSize = 50;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState<string>('');

  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setIsScanning(false);
    setQrData(data);
    
    try {
      const [x, y] = data.split(',').map(Number);
      if (!isNaN(x) && !isNaN(y)) {
        const position = { x, y };
        dispatch(setUserPosition(position));
        Alert.alert('Success', `Navigating to: ${x}, ${y}`);
      } else {
        throw new Error('Invalid coordinates');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format. Expected "x,y" coordinates.');
    }
  };

  useEffect(() => {
    if (productPosition && userPosition) {
      const dist = calculateDistance(userPosition, productPosition);
      if (dist < 30) {
        setShowCelebration(true);
        setToastMessage('🎉 You found it! Great job! 🎉');
        stopPdrTracking();
        setTimeout(() => {
          setShowCelebration(false);
          dispatch(resetMap());
        }, 3000);
      }
    }
  }, [userPosition, productPosition]);

  const handleDismissToast = () => {
    setShowCelebration(false);
    setToastMessage('');
  };

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
        {/* <Button 
          title={isTracking ? "Stop Tracking" : "Start Tracking"}
          onPress={() => isTracking ? stopPdrTracking() : startPdrTracking()}
          color={isTracking ? "#ff4444" : "#4CAF50"}
        /> */}
          <TouchableOpacity
            style={[
              styles.trackingButton,
              { backgroundColor: isTracking ? '#CCCCCC' : '#4CAF50' }
            ]}
            onPress={() => isTracking ? stopPdrTracking() : startPdrTracking()}
          >
            <Ionicons 
              name="rocket" 
              size={24} 
              color={isTracking ? '#666666' : 'white'} 
            />
          </TouchableOpacity>

        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => {
            setScanned(false);
            setIsScanning(true);
          }}
        >
          <Ionicons name="qr-code" size={24} color="white" />
        </TouchableOpacity>
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
      {isScanning && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsScanning(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </CameraView>
      )}

      <Celebration isActive={showCelebration} />
    
      {toastMessage && (
        <TouchableOpacity
          style={styles.toast}
          onPress={handleDismissToast}
          activeOpacity={0.8}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: '30%',
  },
  qrButton: {
    // marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 11,
    borderRadius: 30,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 30,
  },
  qrFrame: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 0, 0.7)',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  trackingButton: {
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Map;
