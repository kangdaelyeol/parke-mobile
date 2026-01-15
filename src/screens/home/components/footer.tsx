import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FooterIcon from './footer-icon';

export default function Footer() {
  const navigation = useNavigation<any>();

  const IconList = [
    {
      name: 'My',
      iconName: 'user',
    },
    {
      name: 'Scan',
      iconName: 'qrcode',
      onPress: () => navigation.navigate('SearchBLE'),
    },
    {
      name: '설정',
      iconName: 'gear',
      onPress: () => {
        navigation.navigate('Setting');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {IconList.map((icon, idx) => (
          <FooterIcon {...icon} key={idx} />
        ))}
      </View>
    </View>
  );
}

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
