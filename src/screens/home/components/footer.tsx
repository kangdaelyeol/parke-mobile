import React from 'react';
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
          <FooterIcon {...icon} onPress={() => navigation.navigate(icon.key)} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -1,
    width: '102%',
    left: '-1%',
    backgroundColor: '#16181b',
    height: 90,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
    borderColor: '#2d2d2d',
    borderWidth: 1,
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
