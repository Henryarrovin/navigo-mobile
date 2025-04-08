import { SafeAreaView, StyleSheet } from "react-native";
import Map from "../components/map/Map";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MapScreen = () => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <Map />
        </SafeAreaView>
      </GestureHandlerRootView>
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
