import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { LogoText } from '@/assets/logo';
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants';
import { useScanCompleteContext } from '@/contexts/scan-complete-context';

export const Card = () => {
  const {
    state: { name, phone, message },
  } = useScanCompleteContext();
  const animatedStyle = useAnimatedStyle(() => ({}));
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.bottomBackground} />
      <View style={styles.wrapper}>
        <LogoText width={50} height={45} />
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.phone}>{phone}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1f222b',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 40,
  },
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    paddingHorizontal: 10,
  },
  title: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#cccccc',
  },
  phone: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#cccccc',
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(38, 43, 55, 0.51)',
  },
  ellipsis: { color: '#fff', position: 'absolute', right: 15, top: 13 },
  message: {
    color: '#616161',
    position: 'absolute',
    left: 10,
    bottom: 65,
    fontSize: 15,
  },
  autoChange: {
    position: 'absolute',
    left: 14,
    bottom: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
});
