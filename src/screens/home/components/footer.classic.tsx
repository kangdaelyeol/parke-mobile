import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useFooterViewModel } from '@home/view-model'
import { footerIconList } from '@home/config/footer.config'
import { useTabBarLayout } from '@/hooks'
import { DARK } from '@/theme/color'
import { ClassicFooterIcon } from './footer-icon.classic'
import { CONTENT_MAX_WIDTH, SMALL_SCREEN_WIDTH } from '@/theme/layout'

// 기본 테마 탭바: 화면 아래에 붙은 어두운 바 (처음 푸터). 홈 · My · 설정을 오가도 그대로 남는다
export const ClassicFooter = ({ state, navigation }: BottomTabBarProps) => {
  const vm = useFooterViewModel({ state, navigation })
  const { width } = useWindowDimensions()
  const { height } = useTabBarLayout()
  const isSmall = width < SMALL_SCREEN_WIDTH

  return (
    <Animated.View
      pointerEvents={vm.state.isSetting ? 'none' : 'auto'}
      style={[styles.container, { height }, vm.animated.containerStyle]}
    >
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {footerIconList.map(item => (
          <ClassicFooterIcon
            iconSize={isSmall ? 20 : 27}
            key={item.key}
            iconName={item.iconName}
            label={item.label}
            active={item.key === vm.state.focusedName}
            onPress={() => vm.actions.itemPress(item)}
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
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 30,
    paddingTop: 10,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperSmall: { paddingHorizontal: 30, paddingTop: 5 },
})
