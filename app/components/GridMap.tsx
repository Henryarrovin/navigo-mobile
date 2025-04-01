import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Pointer from './Pointer';
import Compass from './Compass';
import StepCounter from './StepCounter';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 8;
const CELL_SIZE = Math.max(width, height) / (GRID_SIZE + 2);
const CENTER = { x: width / 2 - CELL_SIZE * 2.3, y: height / 2 - CELL_SIZE / 2 };

export default function GridMap({ 
  position, 
  heading, 
  steps, 
  distance 
}: {
  position: { x: number; y: number };
  heading: number;
  steps: number;
  distance: string;
}) {
  // Convert position to grid coordinates (1-8)
  const gridX = Math.min(Math.max(Math.round(position.x) + 4, 1), 8);
  const gridY = Math.min(Math.max(Math.round(position.y) + 4, 1), 8);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <View 
            key={`v${i}`} 
            style={[
              styles.line, 
              styles.vertical, 
              { left: i * CELL_SIZE }
            ]} 
          />
        ))}
        
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <View 
            key={`h${i}`} 
            style={[
              styles.line, 
              styles.horizontal, 
              { top: i * CELL_SIZE }
            ]} 
          />
        ))}
      </View>

      <View style={[styles.pointerContainer, { left: CENTER.x, top: CENTER.y }]}>
        <Pointer heading={heading} />
        <Text style={styles.coordinates}>
          ({gridX}, {GRID_SIZE - gridY + 1})
        </Text>
      </View>

      <View style={styles.infoPanel}>
        <View style={styles.compassWrapper}>
          <Compass heading={heading} />
        </View>
        <StepCounter steps={steps} distance={distance} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gridContainer: {
    position: 'absolute',
    width: CELL_SIZE * (GRID_SIZE + 1),
    height: CELL_SIZE * (GRID_SIZE + 1),
    top: (height - CELL_SIZE * (GRID_SIZE + 1)) / 2,
    left: (width - CELL_SIZE * (GRID_SIZE + 1)) / 2,
  },
  line: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  pointerContainer: {
    position: 'absolute',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    alignItems: 'center',
    zIndex: 10,
  },
  coordinates: {
    marginTop: 32,
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    borderRadius: 4,
  },
  infoPanel: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    gap: 12,
  },
  compassWrapper: {
    alignSelf: 'flex-end',
  },
});