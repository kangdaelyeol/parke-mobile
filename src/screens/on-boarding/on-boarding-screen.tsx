import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Footer, Header, Slider } from '@on-boarding/components';
import { OnBoardingContextProvider } from '@/contexts';
import { useOnBoardingViewModel } from '@/view-model';
import { Loading } from '@/components';

const OnBoarding = () => {
  const { state } = useOnBoardingViewModel();

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <Header />
      <Slider />
      <Footer />
    </View>
  );
};

export default function OnBoardingScreen() {
  return (
    <OnBoardingContextProvider>
      <OnBoarding />
    </OnBoardingContextProvider>
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
