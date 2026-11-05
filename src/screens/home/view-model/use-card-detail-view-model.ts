import { useEffect, useState } from 'react'
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import {
  DETAIL_GAP,
  useCardSettingContext,
  useCardSliderContext,
} from '@home/contexts'
import { useCardViewModel } from '@home/view-model'
import { CardDetailTab, HomeCardDetailViewModel } from '@home/types'

// 유리 카드 + 상세(드롭다운). 카드 기능(자동감지, 번호 변경, 수정, 삭제 등)은 기존 카드 뷰모델을 그대로 쓴다
export const useCardDetailViewModel = (
  idx: number,
): HomeCardDetailViewModel => {
  const card = useCardViewModel(idx)
  const { detailCard, detailProgress, detailController } =
    useCardSettingContext()
  const { selectedCardIdx, isSliding } = useCardSliderContext()
  // 넘기는 중(또는 막 넘긴 직후)의 누름은 무시한다
  const guard =
    <A extends unknown[]>(fn: (...args: A) => void) =>
    (...args: A) => {
      if (!isSliding()) fn(...args)
    }
  const [tab, setTab] = useState<CardDetailTab>('info')
  const open = detailCard === idx

  const panelHeight = useSharedValue(0)

  // 어떻게 닫혔든(접기·넘기기·수정·삭제) 다 닫히면 카드 정보 탭으로 돌려 둔다
  useEffect(() => {
    if (!open) setTab('info')
  }, [open])

  // 다른 카드의 상세가 열려 있어도 이 카드는 닫힌 채로 둔다
  const progress = useDerivedValue(() => (open ? detailProgress.value : 0))

  // 닫힘(0): 판 전체가 창 위로 올라가 보이지 않는다 / 열림(1): 제자리.
  // 위치와 투명도만 바꾸므로 펼치는 동안 레이아웃을 다시 계산하지 않는다
  const panelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value * 3),
    transform: [
      { translateY: (progress.value - 1) * (panelHeight.value + DETAIL_GAP) },
    ],
  }))

  return {
    state: { open, tab, loading: card.state.loading },
    actions: {
      togglePress: guard(() => {
        if (selectedCardIdx !== idx || card.state.settingCard !== -1)
          return card.actions.cardPress()
        if (open) return detailController.close()
        detailController.open(idx, panelHeight.value)
      }),
      tabPress: guard(setTab),
      previewPress: guard(card.actions.previewPress),
      drivePress: guard(card.actions.drivePress),
      scanChange: guard(() => card.actions.scanChangePress()),
      changePhonePress: guard(card.actions.changePhonePress),
      recordsPress: guard(card.actions.recordsPress),
      // 상세를 접은 뒤 수정 화면을 연다
      editPress: guard(() => detailController.close(card.actions.editPress)),
      deletePress: guard(() =>
        card.actions.deletePress(detailController.reset),
      ),
      panelLayout: height => {
        panelHeight.value = height
      },
    },
    animated: {
      cardStyle: card.animated.cardStyle,
      scanOnDotStyle: card.animated.scanOnDotStyle,
      panelStyle,
      progress,
    },
  }
}
