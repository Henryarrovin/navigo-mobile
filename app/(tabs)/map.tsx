import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const MapScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Map</Text>
      </SafeAreaView>
    );
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'blue',
  }
});
