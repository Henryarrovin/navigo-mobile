import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import LottieView from 'lottie-react-native';

const Celebration = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        explosionSpeed={300}
        fallSpeed={2000}
      />
      <LottieView
        autoPlay
        loop={false}
        source={require('../../assets/animation/celebrate.json')}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 100,
  },
});

export default Celebration;
