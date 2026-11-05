import { JSX } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { TEXT, withAlpha } from '@/theme/glass'
import { Toggle } from '@/components'
import {
  ActiveIllustration,
  BellIllustration,
  BluetoothIllustration,
  CameraIllustration,
  LocationIllustration,
  QrIllustration,
  SerialIllustration,
} from '@/components/illustrations/item'

type ItemOption =
  | 'bluetooth'
  | 'notify'
  | 'active'
  | 'camera'
  | 'qr'
  | 'serial'
  | 'location'

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
  location: LocationIllustration,
}

// 아이콘 선 색. 아이콘 타일은 이 색을 옅게 깐 유리로 만든다
const ICON_COLORS: Record<ItemOption, string> = {
  bluetooth: '#92b3ff',
  notify: '#34d399',
  active: '#F87171',
  camera: '#6e70ff',
  qr: '#3b3bf9',
  serial: '#34d399',
  location: '#ffb84d',
}

// 렌더할 때마다 색 문자열을 만들지 않도록 종류별 타일 색을 미리 만들어 둔다
const ICON_TILES = Object.fromEntries(
  Object.entries(ICON_COLORS).map(([option, color]) => [
    option,
    {
      backgroundColor: withAlpha(color, 0.14),
      borderColor: withAlpha(color, 0.28),
    },
  ]),
) as Record<ItemOption, { backgroundColor: string; borderColor: string }>

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
  const isSmall = width < 400

  const Icon = ICONS[option]
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, isSmall && styles.containerSmall]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            isSmall && styles.iconContainerSmall,
            ICON_TILES[option],
          ]}
        >
          <Icon />
        </View>
        <View style={styles.descSection}>
          <Text style={[styles.title, isSmall && styles.titleSmall]}>
            {title}
          </Text>
          <Text style={[styles.subTitle, isSmall && styles.subTitleSmall]}>
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
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  containerSmall: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    padding: 8,
  },
  iconContainerSmall: {
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: 5,
  },
  descSection: {
    marginLeft: 13,
    gap: 3,
  },
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  titleSmall: {
    fontSize: 14,
  },
  subTitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  subTitleSmall: {
    fontSize: 10,
  },
  right: { justifyContent: 'center' },
})
