import { useState } from 'react'
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  DETAIL_GAP,
  useCardSettingContext,
  useCardSliderContext,
} from '@home/contexts'
import { useCardViewModel } from '@home/view-model'
import { CardDetailTab, HomeCardDetailViewModel } from '@home/types'

const TAB_MS = 260

// 유리 카드 + 상세(드롭다운). 카드 기능(자동감지, 번호 변경, 수정, 삭제 등)은 기존 카드 뷰모델을 그대로 쓴다
export const useCardDetailViewModel = (
  idx: number,
): HomeCardDetailViewModel => {
  const card = useCardViewModel(idx)
  const { detailCard, detailProgress, detailController } =
    useCardSettingContext()
  const { selectedCardIdx } = useCardSliderContext()
  const [tab, setTab] = useState<CardDetailTab>('info')
  const open = detailCard === idx

  const panelHeight = useSharedValue(0)
  const segmentWidth = useSharedValue(0)
  const tabProgress = useSharedValue(0)

  // 다른 카드의 상세가 열려 있어도 이 카드는 닫힌 채로 둔다
  const progress = useDerivedValue(() => (open ? detailProgress.value : 0))

  const panelStyle = useAnimatedStyle(() => ({
    height: progress.value * panelHeight.value,
    marginTop: progress.value * DETAIL_GAP,
    opacity: Math.min(1, progress.value * 3),
  }))

  // 탭 아래 깔린 알약이 선택한 탭으로 미끄러진다 (탭 2개, 안쪽 여백 4)
  const indicatorStyle = useAnimatedStyle(() => ({
    width: Math.max(0, segmentWidth.value / 2 - 4),
    transform: [
      { translateX: tabProgress.value * (segmentWidth.value / 2 - 4) },
    ],
  }))

  const selectTab = (next: CardDetailTab) => {
    setTab(next)
    tabProgress.value = withTiming(next === 'info' ? 0 : 1, {
      duration: TAB_MS,
    })
  }

  return {
    state: { open, tab, loading: card.state.loading },
    actions: {
      togglePress: () => {
        if (selectedCardIdx !== idx || card.state.settingCard !== -1)
          return card.actions.cardPress()
        if (open) return detailController.close()
        // 열 때는 항상 카드 정보 탭부터
        setTab('info')
        tabProgress.value = 0
        detailController.open(idx, panelHeight.value)
      },
      tabPress: selectTab,
      previewPress: card.actions.previewPress,
      drivePress: card.actions.drivePress,
      scanChange: () => card.actions.scanChangePress(),
      changePhonePress: card.actions.changePhonePress,
      recordsPress: card.actions.recordsPress,
      // 상세를 접은 뒤 수정 화면을 연다
      editPress: () => detailController.close(card.actions.editPress),
      deletePress: () => card.actions.deletePress(detailController.reset),
      panelLayout: height => {
        panelHeight.value = height
      },
      segmentLayout: width => {
        segmentWidth.value = width
      },
    },
    animated: {
      cardStyle: card.animated.cardStyle,
      scanOnDotStyle: card.animated.scanOnDotStyle,
      panelStyle,
      indicatorStyle,
      progress,
    },
  }
}
