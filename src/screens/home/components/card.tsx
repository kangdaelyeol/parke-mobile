import { LogoText } from '@/assets/logo';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CARD_HEIGHT, CARD_WIDTH } from '../constants';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useCardSettingContext } from '@/contexts/card-setting-context';
import { useCardSliderContext } from '@/contexts/slider-context';

export const Card = ({ title, phone, idx, message, autoChange }: any) => {
  const {  settingCard } = useCardSettingContext();
  const { selectedCardIdx, sliderController } = useCardSliderContext();
  const animatedStyle = useAnimatedStyle(() => {
    const isSelected = idx === selectedCardIdx.value;
    return {
      opacity: withTiming(isSelected ? 1 : 0.4, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(isSelected ? 0 : 15, {
            easing: Easing.out(Easing.cubic),
            duration: 150,
          }),
        },
      ],
    };
  });

  const onCardPressed = () => {
    if (settingCard !== -1) return;
    else {
      sliderController.goToIdx(idx);
    }
  };

  return (
    <Pressable onPress={onCardPressed}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.bottomBackground} />
        <View style={styles.wrapper}>
          <LogoText width={50} height={45} />
          <FontAwesome6
            name="ellipsis"
            iconStyle="solid"
            size={17}
            style={styles.ellipsis}
          />
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        {autoChange ? (
          <View style={styles.autoChange}>
            <View style={[styles.onIcon, styles.icon]} />
            <Text style={[styles.autoChangeTextOn, styles.autoChangeText]}>
              자동변경 On
            </Text>
          </View>
        ) : (
          <View style={styles.autoChange}>
            <View style={[styles.offIcon, styles.icon]} />
            <Text style={[styles.autoChangeTextOff, styles.autoChangeText]}>
              자동변경 Off
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
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
  onIcon: {
    backgroundColor: '#00ed08',
    boxShadow: '0px 0px 5px 2px #299c32',
  },
  offIcon: {
    backgroundColor: '#ed3a3a',
    boxShadow: '0px 0px 5px 2px #fa4c31',
  },
  autoChangeText: {
    fontSize: 14,
    fontWeight: 500,
  },
  autoChangeTextOn: {
    color: '#4fa75c',
  },
  autoChangeTextOff: {
    color: '#c02b2b',
  },
});
