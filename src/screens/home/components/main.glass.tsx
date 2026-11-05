import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector, ScrollView } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SLIDER_GAP } from '@home/constants'
import { useCardSize } from '@home/hooks'
import { CardSkeleton } from './card-skeleton'
import { EmptyCard } from './empty-card'
import { GlassCard } from './glass-card'
import { GlassCardInfo } from './glass-card-info'
import { GlassTopBar } from './glass-top-bar'
import { SettingCard } from './setting-card'
import { TodaySummary } from './today-summary'
import { useMainViewModel } from '@home/view-model'
import { CardInfoTab, HomeMainProps } from '@home/types'
import { useTabBarLayout } from '@/hooks'
import { GLASS_LAYOUT } from '@/theme/glass'

// 홈 본문 (글래스): 영상 Overview처럼 판을 위에서 아래로 쌓고 세로로 스크롤한다.
// 상단 바 → 오늘의 현황(통계 카드 2×2) → 내 기기 판(좌우로 넘김) → 고른 카드의 정보 판.
// 탭바는 아래에 떠서 그대로 있고(영상의 사이드바), 상단 바는 본문과 같이 올라간다
export const GlassMain = ({ loading }: HomeMainProps) => {
  const { state, actions, animated } = useMainViewModel()
  // 카드를 아직 한 번도 못 불러온 상태에서만 뼈대를 보여준다
  const showSkeleton = loading && state.cardLength === 0
  // 판 폭은 모두 카드 폭과 같다
  const cardSize = useCardSize()
  const { top } = useSafeAreaInsets()
  const { space } = useTabBarLayout()
  // 카드를 넘겨도 보던 탭(정보 / 관리)은 그대로 둔다
  const [infoTab, setInfoTab] = useState<CardInfoTab>('info')
  // 맨 끝 카드 추가 칸을 보고 있으면 정보 판이 없다
  const selectedCard = showSkeleton
    ? undefined
    : state.cards[state.selectedCardIdx]

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: top + GLASS_LAYOUT.topGap,
          paddingBottom: space,
        }}
      >
        {/* 수정 화면이 열리면 본문 전체가 제자리에서 사라지고 터치도 받지 않는다 */}
        <Animated.View
          pointerEvents={state.isSetting ? 'none' : 'auto'}
          style={[
            styles.column,
            { width: cardSize.width },
            animated.homeContentStyle,
          ]}
        >
          <GlassTopBar />
          <TodaySummary />
          <GestureDetector gesture={actions.panGesture}>
            <Animated.View style={cardSize}>
              <Animated.View style={[animated.moverStyle, styles.mover]}>
                {showSkeleton ? (
                  <CardSkeleton />
                ) : (
                  <>
                    {state.cards.map((card, idx) => (
                      <GlassCard key={card.id} card={card} idx={idx} />
                    ))}
                    <EmptyCard idx={state.cardLength} />
                  </>
                )}
              </Animated.View>
            </Animated.View>
          </GestureDetector>
          {selectedCard && (
            // 카드마다 새로 그린다: 넘기면 내용이 바로 바뀌고, 앞 카드의 로딩 표시도 따라오지 않는다
            <GlassCardInfo
              key={selectedCard.id}
              idx={state.selectedCardIdx}
              tab={infoTab}
              onTabChange={setInfoTab}
            />
          )}
        </Animated.View>
      </ScrollView>
      {state.editingCard && <SettingCard card={state.editingCard} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  column: {
    marginHorizontal: 'auto',
    gap: 12,
  },
  mover: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SLIDER_GAP,
  },
})
