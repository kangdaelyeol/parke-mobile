import { JSX } from 'react'
import { StyleSheet, View, Text, Pressable, ViewStyle } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY } from '@/theme/color'
import { TEXT, withAlpha } from '@/theme/glass'
import { useThemed, useThemedSheet } from '@/theme/themed'
import type { ThemeId } from '@/theme/themes'
import { Toggle } from './toggle'
import {
  ActiveIllustration,
  BellIllustration,
  BluetoothIllustration,
  CameraIllustration,
  LocationIllustration,
  QrIllustration,
  SerialIllustration,
} from '@/components/illustrations/item'
import { useIsSmallScreen } from '@/theme/layout'

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

// 기본 테마 아이콘 바탕 (처음 디자인: 어두운 색 칸)
const ICON_BG_COLORS: Record<ItemOption, string> = {
  bluetooth: '#1a1a3a',
  notify: '#1a2a1a',
  active: '#2a1a1a',
  camera: '#19192a',
  qr: '#1a1a2a',
  serial: '#1a2a1a',
  location: '#2a221a',
}

// 테마별 종류마다 아이콘 칸 색. 렌더할 때마다 색 문자열을 만들지 않도록 미리 만들어 둔다
const ICON_TILES: Record<ThemeId, Record<ItemOption, ViewStyle>> = {
  classic: Object.fromEntries(
    Object.entries(ICON_BG_COLORS).map(([option, color]) => [
      option,
      { backgroundColor: color },
    ]),
  ) as Record<ItemOption, ViewStyle>,
  // 글래스: 아이콘 선 색을 옅게 깐 유리 타일
  'glass-dashboard': Object.fromEntries(
    Object.entries(ICON_COLORS).map(([option, color]) => [
      option,
      {
        backgroundColor: withAlpha(color, 0.14),
        borderColor: withAlpha(color, 0.28),
      },
    ]),
  ) as Record<ItemOption, ViewStyle>,
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
  const isSmall = useIsSmallScreen()

  const Icon = ICONS[option]
  const themed = useThemedSheet<typeof glass>({
    classic,
    'glass-dashboard': glass,
  })
  const iconTile = useThemed(ICON_TILES)[option]
  return (
    <Pressable
      onPress={onPress}
      style={[themed.container, isSmall && styles.containerSmall]}
    >
      <View style={styles.left}>
        <View
          style={[
            themed.iconContainer,
            isSmall && styles.iconContainerSmall,
            iconTile,
          ]}
        >
          <Icon />
        </View>
        <View style={styles.descSection}>
          <Text style={[themed.title, isSmall && styles.titleSmall]}>
            {title}
          </Text>
          <Text style={[themed.subTitle, isSmall && styles.subTitleSmall]}>
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

// 두 테마 공통 (작은 화면 크기 등)
const styles = StyleSheet.create({
  containerSmall: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleSmall: {
    fontSize: 14,
  },
  subTitleSmall: {
    fontSize: 10,
  },
  right: { justifyContent: 'center' },
})

// 글래스: 유리 판 안의 줄
const glass = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
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
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  subTitle: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  iconContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
    borderRadius: 9,
    padding: 8,
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
})
