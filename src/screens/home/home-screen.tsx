import { StyleSheet, View } from 'react-native';
import { CardSettingProvider, SliderContextProvider } from '@/contexts';
import { Header, Footer, Main } from '@home/components';
import { useHomeViewModel } from '@/view-model';

export default function HomeScreen() {
  useHomeViewModel();

  return (
    <CardSettingProvider>
      <SliderContextProvider>
        <View style={styles.container}>
          <Header />
          <Main />
          <Footer />
        </View>
      </SliderContextProvider>
    </CardSettingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
