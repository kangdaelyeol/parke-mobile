import { StyleSheet, View } from 'react-native';
import { LogoIcon, LogoText } from '@/assets/logo';

export const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <LogoIcon style={styles.logoIcon} width={40} height={50} />
        <LogoText style={styles.logoText} width={120} height={50} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 150,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
  },
  logoIcon: {
    marginTop: 0,
  },
  logoText: {
    marginTop: 5,
    marginLeft: 10,
  },
});
