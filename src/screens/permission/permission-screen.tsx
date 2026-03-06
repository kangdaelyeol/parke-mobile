import { StyleSheet, View } from 'react-native';
import { Footer, Header, Main } from '@permission/components';

export default function PermissionScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Main />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
