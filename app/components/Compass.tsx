import { View, StyleSheet, Text } from 'react-native';

export default function Compass({ heading }: { heading: number }) {
  const degrees = ((heading * 180) / Math.PI).toFixed(0);
  
  return (
    <View style={[styles.container, { transform: [{ rotate: `${-heading}rad` }] }]}>
      <>
        <Text style={styles.north}>N</Text>
        <Text style={styles.degree}>{degrees}°</Text>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  north: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  degree: {
    fontSize: 12,
    color: '#333',
  },
});