import { JSX } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY } from '@/theme/color'
import { Toggle } from '@/components'
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
  const { width } = useWindowDimensions()
  const style =
    width < 400
      ? {
          container: {
            paddingHorizontal: 10,
            paddingVertical: 10,
          },
          title: {
            fontSize: 14,
          },
          subTitle: {
            fontSize: 10,
          },
          iconContainer: {
            width: 30,
            height: 30,
            padding: 5,
            borderRadius: 5,
          },
        }
      : {
          container: {
            paddingHorizontal: 20,
            paddingVertical: 18,
          },
          title: {
            fontSize: 16,
          },
          subTitle: {
            fontSize: 12,
          },
          iconContainer: {
            width: 42,
            height: 42,
            borderRadius: 9,
            padding: 8,
          },
        }

  const Icon = ICONS[option]
  const backgroundColor = ICON_BG_COLORS[option]
  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles.container, ...style.container }}
    >
      <View style={styles.left}>
        <View style={{ ...styles.iconContainer, ...style.iconContainer }}>
          <View style={[styles.iconBackground, { backgroundColor }]} />
          <Icon />
        </View>
        <View style={styles.descSection}>
          <Text style={{ ...styles.title, ...style.title }}>{title}</Text>
          <Text style={{ ...styles.subTitle, ...style.subTitle }}>
            {subTitle}
          </Text>
        </View>
      </View>
      {onValueChange && value !== undefined && (
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
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
  },
  subTitle: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
  },
  right: { justifyContent: 'center' },
})
