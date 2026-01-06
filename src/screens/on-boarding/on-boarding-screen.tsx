import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from './components/header';
import Footer from './components/footer';
import Slider from './components/slider';
import { OnBoardContextProvider } from '../../contexts/on-board-context';

export default function onBoardingScreenWithProps(
  props: React.JSX.IntrinsicAttributes & {
    setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
  },
) {
  return (
    reactProps: React.JSX.IntrinsicAttributes & {
      setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
    },
  ): React.JSX.Element => <OnBoardingScreen {...reactProps} {...props} />;
}

function OnBoardingScreen({
  setHasSeenOnBoarding,
}: {
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <OnBoardContextProvider>
      <View style={styles.container}>
        <Header />
        <Slider />
        <Footer setHasSeenOnBoarding={setHasSeenOnBoarding} />
      </View>
    </OnBoardContextProvider>
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
