import { Header, Main } from '@setting/components';
import { StyleSheet, View } from 'react-native';
export default function SettingScreen() {
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
