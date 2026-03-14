import { JSX } from 'react'
import { StyleSheet, View, Text, StyleProp, ViewStyle } from 'react-native'
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

interface GetIconUIValue {
  Icon: () => JSX.Element
  backgroundStyle: StyleProp<ViewStyle>
}

const getIconUI = (option: ItemOption): GetIconUIValue => {
  switch (option) {
    case 'autoChange':
      return {
        Icon: BluetoothIllustration,
        backgroundStyle: styles.bluetoothBackground,
      }
    case 'notify':
      return {
        Icon: BellIllustration,
        backgroundStyle: styles.alertBackground,
      }
    case 'active':
      return {
        Icon: ActiveIllustration,
        backgroundStyle: styles.activeBackground,
      }
  }
}

export const Item = ({
  option,
  title,
  subTitle,
  value,
  onValueChange,
  disabled,
}: ItemProps) => {
  const { Icon, backgroundStyle } = getIconUI(option)
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <View style={backgroundStyle} />
          <Icon />
        </View>
        <View style={styles.descSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
      <View>
        <Toggle
          disabled={disabled}
          value={value}
          onValueChange={onValueChange}
        />
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9,
    backgroundColor: '#1a2a1a',
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9,
    backgroundColor: '#2a1a1a',
  },
  bluetoothBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9,
    backgroundColor: '#1a1a3a',
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
