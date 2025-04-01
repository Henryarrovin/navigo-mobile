import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const HomeScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Home</Text>
      </SafeAreaView>
    );
}

export default HomeScreen;

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