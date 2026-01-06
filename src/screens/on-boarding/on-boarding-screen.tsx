import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/header';
import Footer from './components/footer';
import Slider from './components/slider';

export default function OnBoardingScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Slider />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    height: '100%',
  },
  text: {
    color: 'white',
  },
});
