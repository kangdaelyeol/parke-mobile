import { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import {
  SETTING_RANGE,
  settingSegment,
  useCardSettingContext,
} from '@home/contexts'
import { FooterItem, HomeFooterViewModel } from '@home/types'
import { useTabBarLayout } from '@/hooks'

// 아래 탭바 동작 (두 테마 공통): 탭 바꾸기, 스캔 화면 띄우기, 카드 수정 중 숨기기
export const useFooterViewModel = ({
  state,
  navigation,
}: Pick<BottomTabBarProps, 'state' | 'navigation'>): HomeFooterViewModel => {
  const { isSetting, settingProgress } = useCardSettingContext()
  const { height, bottom } = useTabBarLayout()
  const focusedName = state.routes[state.index]?.name ?? ''
  // 그림자까지 화면 밖으로 내려가도록
  const hiddenY = height + bottom + 30

  // 카드 수정 중에는 아래로 내려가며 숨고, 그 자리를 저장/취소 바가 대신한다
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          settingSegment(settingProgress.value, SETTING_RANGE.footer),
          [0, 1],
          [0, hiddenY],
        ),
      },
    ],
  }))

  const itemPress = (item: FooterItem) => {
    // 스캔처럼 탭이 아닌 항목은 탭바 위로 새 화면을 띄운다
    if (!item.tab) return navigation.navigate(item.key)

    const route = state.routes.find(r => r.name === item.key)
    const event = navigation.emit({
      type: 'tabPress',
      target: route?.key,
      canPreventDefault: true,
    })
    if (focusedName !== item.key && !event.defaultPrevented)
      navigation.navigate(item.key)
  }

  return {
    state: { focusedName, isSetting },
    actions: { itemPress },
    animated: { containerStyle },
  }
}
