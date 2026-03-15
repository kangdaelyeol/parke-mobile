import { StyleSheet, Text, View } from 'react-native'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useScanCompleteContext } from '@/contexts/scan-complete-context'
import { DM_MONO, DM_SANS } from '@/theme/fonts'
import { DARK_LIGHT, GRAY, WHITE } from '@/theme/color'

type CardProps = {
  deviceId: string
}

const BOTTOM_HEIGHT = 60
const TOP_HEIGHT = CARD_HEIGHT - BOTTOM_HEIGHT

export const Card = ({ deviceId }: CardProps) => {
  const {
    state: { name, phone, message, serial },
  } = useScanCompleteContext()

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.topSection}>
          <Text style={styles.brand}>Parké</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoLabel}>
          <Text style={styles.infoTitle}>device ID</Text>
          <Text style={styles.infoText}>{deviceId}</Text>
          <Text style={styles.infoTitle}>serial</Text>
          <Text style={styles.infoText}>{serial}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#141414',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    overflow: 'hidden',
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    position: 'absolute',
    bottom: 35,
    left: 17,
    fontSize: 22,
    fontFamily: DM_MONO.MEDIUM,
    color: WHITE,
  },
  message: {
    position: 'absolute',
    bottom: 10,
    right: 18,
    fontSize: 12,
    fontFamily: DM_MONO.MEDIUM,
    color: GRAY,
  },
  phone: {
    position: 'absolute',
    bottom: 25,
    right: 15,
    fontSize: 14,
    fontFamily: DM_MONO.MEDIUM,
    color: GRAY,
  },
  infoLabel: {
    position: 'absolute',
    left: 10,
    bottom: 4,
    // flexDirection: 'row',
  },
  infoTitle: {
    color: WHITE,
    fontSize: 11,
    fontFamily: DM_MONO.MEDIUM,
  },
  infoText: {
    color: GRAY,
    fontSize: 8,
    fontFamily: DM_MONO.REGULAR,
  },
  brand: {
    position: 'absolute',
    top: 15,
    left: 15,
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
  },
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_HEIGHT,
  },
  divider: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: DARK_LIGHT,
    bottom: BOTTOM_HEIGHT,
  },
})
