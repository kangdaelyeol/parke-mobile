import { StyleSheet, View } from 'react-native';
import { useSettingViewModel } from '@/view-model';
import { Header, Main } from '@setting/components';
export default function SettingScreen() {
  useSettingViewModel();
  return (
    <View style={styles.container}>
      <Header />
      <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: '100%',
  },
});
