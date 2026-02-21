import { StyleSheet, View } from 'react-native';
import { Main, Header } from '@profile/components';

export default function ProfileScreen() {

  return (
    <View style={styles.container}>
      <Header />
      <Main  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
