import { StyleSheet, View } from 'react-native';
import { CardSettingProvider, SliderContextProvider } from '@/contexts';
import { Header, Footer, Main } from '@home/components';
import { useHomeViewModel } from '@/view-model';
import { Loading } from '@/components';

export default function HomeScreen() {
  const { state } = useHomeViewModel();

  return (
    <CardSettingProvider>
      <SliderContextProvider>
        <View style={styles.container}>
          {state.loading && <Loading />}
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
