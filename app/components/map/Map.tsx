import { RouteProp, useRoute } from "@react-navigation/native";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Line, G, Circle } from 'react-native-svg';

type RootTabParamList = {
  Home: undefined;
  Map: { 
    x: number;
    y: number;
    title: string;
  };
};

type MapRouteProp = RouteProp<RootTabParamList, 'Map'>;

const Map = () => {
    const route = useRoute<MapRouteProp>();
    const { x, y, title } = route.params || {};

    const { width } = Dimensions.get('window');
    const svgWidth = width - 40;  // SVG width based on screen width
    const svgHeight = (svgWidth * 600) / 800;  // Maintain aspect ratio for height
    const gridSize = 50;  // Distance between grid lines in SVG units

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
      
          // except 0
          if (y > 0) {
            gridLabels.push(
                <Text 
                    key={`y-${y}`} 
                    style={[styles.gridLabel, { 
                    top: (y / 600) * svgHeight - 8, 
                    color: '#0288d1' ,
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
      
          // except 0
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

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.mapWrapper}>
                    <Svg width={svgWidth} height={svgHeight} viewBox="0 0 800 600">
                        {renderGrid()}
                        <Path id="zone1" d="M100,100 L400,100 L400,400 L100,400 Z" fill="#e1f5fe" stroke="#0288d1" strokeWidth="2"/>
                        <Path id="zone2" d="M400,100 L700,100 L700,250 L400,250 Z" fill="#e8f5e9" stroke="#388e3c" strokeWidth="2"/>
                        <Path id="zone3" d="M400,250 L700,250 L700,400 L400,400 Z" fill="#fff3e0" stroke="#fb8c00" strokeWidth="2"/>
                        <Path d="M400,175 L400,225" stroke="#000" strokeWidth="3" strokeDasharray="5,5"/>
                        <Path d="M400,325 L400,375" stroke="#000" strokeWidth="3" strokeDasharray="5,5"/>
                        {/* Product Marker */}
                        {x && y && (
                            <Circle
                                cx={x}
                                cy={y}
                                r="10"
                                fill="#ff0000"
                                stroke="#ffffff"
                                strokeWidth="2"
                            />
                        )}
                    </Svg>
                    {x && y && (
                      <View style={styles.coordinateInfo}>
                        <Text style={styles.coordinateTitle}>{title || 'Product Location'}</Text>
                        <Text style={styles.coordinateText}>X Coordinate: {x}</Text>
                        <Text style={styles.coordinateText}>Y Coordinate: {y}</Text>
                      </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4D4D4',
    paddingTop: 20,
    paddingBottom: 20,
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
  },
  gridLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  coordinateInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    width: '100%',
    marginTop: 15,
  },
  coordinateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0288d1',
    marginBottom: 5,
  },
  coordinateText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  }
});

export default Map;
