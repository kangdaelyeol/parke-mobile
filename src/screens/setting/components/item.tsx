import { JSX } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { DARK_LIGHT, GRAY } from '@/theme/color'
import { Toggle } from '@setting/components'
import {
  ActiveIllustration,
  BellIllustration,
  BluetoothIllustration,
} from './illustrations'

type ItemOption = 'autoChange' | 'notify' | 'active'

interface ItemProps {
  title: string
  subTitle: string
  value: boolean
  onValueChange: (val: boolean) => void
  option: ItemOption
  disabled?: boolean
}

const ICONS: Record<ItemOption, () => JSX.Element> = {
  autoChange: BluetoothIllustration,
  notify: BellIllustration,
  active: ActiveIllustration,
}

const ICON_BG_COLORS: Record<ItemOption, string> = {
  autoChange: '#1a1a3a',
  notify: '#1a2a1a',
  active: '#2a1a1a',
}

export const Item = ({
  option,
  title,
  subTitle,
  value,
  onValueChange,
  disabled,
}: ItemProps) => {
  const Icon = ICONS[option]
  const backgroundColor = ICON_BG_COLORS[option]
  return (
    <View style={styles.container}>
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
      <Toggle disabled={disabled} value={value} onValueChange={onValueChange} />
    </View>
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
    width: 35,
    height: 35,
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
  listDivider: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: DARK_LIGHT,
    height: 1.5,
  },
})
