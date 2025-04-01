import { View, StyleSheet } from 'react-native';

export default function Pointer({ heading }: { heading: number }) {
  return (
    <View style={styles.container}>
      <View style={[styles.arrow, { transform: [{ rotate: `${heading}rad` }] }]} />
      <View style={styles.centerDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    position: 'absolute',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});