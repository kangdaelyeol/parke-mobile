import { JSX } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY } from '@/theme/color'
import { Toggle } from '@setting/components'
import {
  ActiveIllustration,
  BellIllustration,
  BluetoothIllustration,
  CameraIllustration,
  QrIllustration,
  SerialIllustration,
} from '@/components/illustrations/item'

type ItemOption = 'bluetooth' | 'notify' | 'active' | 'camera' | 'qr' | 'serial'

interface ItemProps {
  title: string
  subTitle: string
  option: ItemOption
  value?: boolean
  disabled?: boolean
  Right?: () => JSX.Element
  onValueChange?: (val: boolean) => void
  onPress?: () => void
}

const ICONS: Record<ItemOption, () => JSX.Element> = {
  bluetooth: BluetoothIllustration,
  notify: BellIllustration,
  active: ActiveIllustration,
  camera: CameraIllustration,
  qr: QrIllustration,
  serial: SerialIllustration,
}

const ICON_BG_COLORS: Record<ItemOption, string> = {
  bluetooth: '#1a1a3a',
  notify: '#1a2a1a',
  active: '#2a1a1a',
  camera: '#19192a',
  qr: '#1a1a2a',
  serial: '#1a2a1a',
}

export const Item = ({
  option,
  title,
  subTitle,
  value,
  onValueChange,
  disabled,
  Right,
  onPress,
}: ItemProps) => {
  const Icon = ICONS[option]
  const backgroundColor = ICON_BG_COLORS[option]
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor }]} />
            <Icon />
          </View>
          <View style={styles.descSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
        </View>
        {onValueChange && value && (
          <Toggle
            disabled={disabled}
            value={value}
            onValueChange={onValueChange}
          />
        )}
        {Right && (
          <View style={styles.right}>
            <Right />
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  wrapper: {},
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 9,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  descSection: {
    marginLeft: 13,
    gap: 3,
  },
  title: {
    color: 'white',
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 16,
  },
  subTitle: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  right: { justifyContent: 'center' },
})
