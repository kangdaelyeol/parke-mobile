import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { LogoText } from '@/assets/logo'
import { convertPhone } from '@/helpers'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useHomeCardViewModel } from '@/view-model'
import { HomeCardProps } from '@home/types'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'

export const Card = ({ title, phone, idx, message, scan }: HomeCardProps) => {
  const { animated, actions } = useHomeCardViewModel(idx)

  return (
    <Pressable onPress={actions.cardPress}>
      <Animated.View style={[styles.container, animated.cardStyle]}>
        <View style={styles.bottomBackground} />
        <View style={styles.wrapper}>
          <LogoText width={50} height={45} />
          {/* <FontAwesome6
            name="ellipsis"
            iconStyle="solid"
            size={17}
            style={styles.ellipsis}
          /> */}
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.phone}>{convertPhone(String(phone))}</Text>
        </View>
        <View style={styles.scan}>
          <View style={[scan ? styles.onIcon : styles.offIcon, styles.icon]} />
          <Text
            style={[
              scan ? styles.scanTextOn : styles.scanTextOff,
              styles.scanText,
            ]}
          >
            {scan ? '자동감지 On' : '자동감지 Off'}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

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
    fontFamily: DM_MONO.MEDIUM,
    color: '#cccccc',
  },
  phone: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 14,
    fontFamily: DM_MONO.REGULAR,
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
  scan: {
    position: 'absolute',
    left: 14,
    bottom: 12,
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
  scanText: {
    fontSize: 14,
    fontFamily: PRETENDARD.MEDIUM,
  },
  scanTextOn: {
    color: '#4fa75c',
  },
  scanTextOff: {
    color: '#c02b2b',
  },
})
