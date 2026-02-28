import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FooterIcon } from '@home/components';
import { HomeStackNavigationProp } from '@/navigation/types';
import { footerIconList } from '@home/config/footer.config';

export const Footer = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {footerIconList.map(icon => (
          <FooterIcon
            key={icon.key}
            iconName={icon.iconName}
            label={icon.label}
            onPress={() => navigation.navigate(icon.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#16181b',
    height: 90,
    borderColor: '#2d2d2d',
    borderTopWidth: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 30,
    paddingTop: 10,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
