import { useEffect } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { FooterIcon } from '@home/components'
import { useCardSettingContext } from '@home/contexts'
import { HomeStackNavigationProp } from '@/navigation/types'
import { footerIconList } from '@home/config/footer.config'
import { FOOTER_HEIGHT, FOOTER_HEIGHT_SMALL } from '@home/constants'
import { DARK } from '@/theme/color'

export const Footer = () => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { settingCard } = useCardSettingContext()
  const { width } = useWindowDimensions()

  const isSmall = width < 400
  const isSetting = settingCard !== -1
  const height = isSmall ? FOOTER_HEIGHT_SMALL : FOOTER_HEIGHT

  // 카드 수정 중에는 아래로 내려가며 숨고, 그 자리를 저장/취소 바가 대신한다
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withTiming(isSetting ? height : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    })
  }, [isSetting, height, translateY])

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View
      pointerEvents={isSetting ? 'none' : 'auto'}
      style={[styles.container, { height }, containerStyle]}
    >
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {footerIconList.map(icon => (
          <FooterIcon
            iconSize={isSmall ? 20 : 27}
            key={icon.key}
            iconName={icon.iconName}
            label={icon.label}
            onPress={() => navigation.navigate(icon.key)}
          />
        ))}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: DARK,
    borderColor: '#2d2d2d',
    borderTopWidth: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 30,
    paddingTop: 10,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperSmall: { paddingHorizontal: 30, paddingTop: 5 },
})
