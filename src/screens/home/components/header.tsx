import { LogoIcon } from '@/assets/logo';
import { useUserContext } from '@/contexts/user-context';
import { convertPhone } from '@/helpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  const { user } = useUserContext();
  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <LogoIcon width={35} height={35} style={styles.icon} />
        <Text style={styles.phone}>{convertPhone(user.phone)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // backgroundColor: 'white',
    width: '100%',
  },
  headerWrapper: {
    marginTop: 40,
    boxSizing: 'border-box',
    height: 60,
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 12,
  },
  phone: {
    position: 'absolute',
    color: '#eeeeee',
    right: 10,
    top: 22,
    fontSize: 23,
    fontWeight: 700,
    transform: 'scaleY(1.1)',
  },
});
