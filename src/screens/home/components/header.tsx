import { LogoIcon } from '@/assets/logo';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <LogoIcon width={35} height={35} style={styles.icon} />
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
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },

  settingBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 12,
  },
});
