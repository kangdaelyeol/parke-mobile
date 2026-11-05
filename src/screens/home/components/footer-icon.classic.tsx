import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { HomeFooterIconProps } from '@home/types'
import { ICON_COLOR, ICON_COLOR_PRESSED } from '@home/constants'
import { DM_SANS } from '@/theme/fonts'
import { GRAY_LIGHT, WHITE } from '@/theme/color'
import { FooterGlyph } from './footer-glyph'

// 기본 테마 탭바 한 칸 (처음 푸터 아이콘). 보고 있는 탭은 밝게, 나머지는 흐리게
export const ClassicFooterIcon = ({
  label,
  iconName,
  active,
  onPress,
  iconSize,
}: HomeFooterIconProps) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.container}>
          <View style={!active && !pressed && styles.idleIcon}>
            <FooterGlyph
              iconName={iconName}
              iconSize={iconSize}
              color={WHITE}
            />
          </View>
          <Text
            style={[
              styles.title,
              isSmall && styles.titleSmall,
              {
                color: pressed
                  ? ICON_COLOR_PRESSED
                  : active
                  ? ICON_COLOR
                  : GRAY_LIGHT,
              },
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
  idleIcon: {
    opacity: 0.45,
  },
  title: {
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
  titleSmall: {
    fontSize: 10,
    marginTop: 4,
  },
})
