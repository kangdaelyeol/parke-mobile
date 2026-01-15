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
import { useCardSettingModalContext } from '@/contexts/card-setting-modal-context';
import { useCardSliderContext } from '@/contexts/slider-context';

export const Card = ({ title, phone, idx }: any) => {
  const { showOptionModal } = useCardSettingModalContext();
  const { selectedCardIdx } = useCardSliderContext();
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

  return (
    <Pressable
      onPress={() => {
        showOptionModal();
      }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.bottomBackground} />
        <View style={styles.wrapper}>
          <LogoText width={50} height={50} />
          <FontAwesome6
            name="ellipsis"
            iconStyle="solid"
            size={17}
            style={styles.ellipsis}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
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
});
