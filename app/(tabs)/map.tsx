import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Map from "../components/map/Map";

const MapScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Map />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D4D4D4',
  },
});

export default MapScreen;
