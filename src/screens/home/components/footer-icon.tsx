import { Pressable, StyleSheet, Text, View } from 'react-native'
import { HomeFooterProps } from '@home/types'
import { ICON_COLOR, ICON_COLOR_PRESSED } from '@home/constants'
import { DM_SANS } from '@/theme/fonts'
import {
  MyIllustration,
  QrIllustration,
  SettingIllustration,
} from '@home/components'

interface GetIconProps {
  iconName: 'user' | 'qrcode' | 'gear'
  iconSize: number
}

const Icon = ({ iconName, iconSize }: GetIconProps) => {
  switch (iconName) {
    case 'user':
      return <MyIllustration width={iconSize} height={iconSize} />
    case 'qrcode':
      return <QrIllustration width={iconSize} height={iconSize} />
    case 'gear':
      return <SettingIllustration width={iconSize} height={iconSize} />
  }
}

export const FooterIcon = ({
  label,
  iconName,
  onPress,
  iconSize,
}: HomeFooterProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.container}>
          <Icon iconName={iconName} iconSize={iconSize} />
          <Text
            style={[
              {
                color: pressed ? ICON_COLOR_PRESSED : ICON_COLOR,
              },
              styles.title,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    marginTop: 5,
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
    marginTop: 8,
  },
})
