import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { LogoText } from '@/assets/logo';
import { convertPhone } from '@/helpers';
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants';
import { useHomeCardViewModel } from '@/view-model';
import { CardProps } from '@home/types';
import { FONT } from '@/theme/fonts';

export const Card = ({ title, phone, idx, message, autoChange }: CardProps) => {
  const { state, actions } = useHomeCardViewModel(idx);

  return (
    <Pressable onPress={actions.cardPress}>
      <Animated.View style={[styles.container, state.animatedStyle]}>
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
          <Text style={styles.phone}>{convertPhone(String(phone))}</Text>
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
    fontFamily: FONT.REGULAR,
    color: '#cccccc',
  },
  phone: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    fontFamily: FONT.REGULAR,
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
    fontFamily: FONT.MEDIUM,
  },
  autoChangeTextOn: {
    color: '#4fa75c',
  },
  autoChangeTextOff: {
    color: '#c02b2b',
  },
});
