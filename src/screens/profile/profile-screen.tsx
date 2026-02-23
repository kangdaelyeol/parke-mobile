import { StyleSheet, View } from 'react-native';
import { Main, Header } from '@profile/components';
import { useProfileViewModel } from '@/view-model';

export default function ProfileScreen() {
  useProfileViewModel();
  
  return (
    <View style={styles.container}>
      <Header />
      <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
});
