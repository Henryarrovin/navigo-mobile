import { View, StyleSheet, Text } from 'react-native';

export default function StepCounter({ steps, distance }: {
  steps: number;
  distance: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Steps: {steps}</Text>
      <Text style={styles.text}>Distance: {distance}m</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'flex-end',
  },
  text: {
    color: '#333',
    fontSize: 14,
    textAlign: 'right',
  },
});