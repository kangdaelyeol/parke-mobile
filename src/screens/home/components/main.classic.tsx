import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SLIDER_GAP } from '@home/constants'
import { useCardSize } from '@home/hooks'
import { EmptyCard } from './empty-card'
import { SettingCard } from './setting-card'
import { Card } from './card'
import { CardSkeleton } from './card-skeleton'
import { EmptyView } from './empty-view'
import { PaginationDots } from './pagination-dots'
import { TodaySummary } from './today-summary'
import { useMainViewModel } from '@home/view-model'
import { HomeMainProps } from '@home/types'
import { DM_SANS } from '@/theme/fonts'
import { GRAY } from '@/theme/color'

// 홈 본문 (기본 테마): 화면 가운데 카드 슬라이더 + 위쪽 오늘의 현황 + 아래 페이지 점
export const ClassicMain = ({ loading }: HomeMainProps) => {
  const { state, actions, animated } = useMainViewModel()
  // 카드를 아직 한 번도 못 불러온 상태에서만 뼈대를 보여준다.
  // 이미 카드가 있으면 다시 동기화하는 동안에도 기존 카드를 그대로 둔다.
  const showSkeleton = loading && state.cardLength === 0
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  // 카드 칸 크기
  const cardSize = useCardSize()
  // 수정 화면이 열리면 오늘의 현황·페이지 점은 사라지고 터치도 받지 않는다
  const hideHomeContent = state.isSetting

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        {state.cardLength === 0 && !showSkeleton ? (
          <EmptyView />
        ) : (
          <>
            <Animated.View
              pointerEvents={hideHomeContent ? 'none' : 'auto'}
              style={[StyleSheet.absoluteFill, animated.homeContentStyle]}
            >
              <TodaySummary />
            </Animated.View>
            <GestureDetector gesture={actions.panGesture}>
              <Animated.View
                style={[styles.cardContainer, cardSize, animated.sliderStyle]}
              >
                <Animated.View style={animated.cardTitleStyle}>
                  <View style={[classic.title, isSmall && classic.titleSmall]}>
                    <Text
                      style={[
                        classic.titleText,
                        isSmall && classic.titleTextSmall,
                      ]}
                    >
                      내 기기
                    </Text>
                  </View>
                </Animated.View>
                <View style={{ width: cardSize.width }}>
                  <Animated.View
                    style={[animated.moverStyle, styles.cardSliderMover]}
                  >
                    {showSkeleton ? (
                      <CardSkeleton />
                    ) : (
                      <>
                        {state.cards.map((card, idx) => (
                          <Animated.View
                            key={card.id}
                            entering={FadeIn.duration(350)}
                          >
                            {/* 처음 카드 + [...] 바텀시트 */}
                            <Card card={card} idx={idx} />
                          </Animated.View>
                        ))}
                        <EmptyCard idx={state.cardLength} />
                      </>
                    )}
                  </Animated.View>
                </View>
                {!showSkeleton && (
                  <Animated.View
                    pointerEvents={hideHomeContent ? 'none' : 'auto'}
                    style={animated.homeContentStyle}
                  >
                    <PaginationDots />
                  </Animated.View>
                )}
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </View>
      {state.isSetting && (
        <SettingCard card={state.cards[state.selectedCardIdx]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingBottom: 200,
    flex: 1,
  },
  wrapperSmall: {
    maxWidth: 330,
  },
  cardContainer: {
    marginHorizontal: 'auto',
  },
  cardSliderMover: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SLIDER_GAP,
  },
})

// 처음 디자인의 내 기기 제목
const classic = StyleSheet.create({
  title: {
    position: 'absolute',
    top: -40,
    left: -10,
  },
  titleSmall: {
    top: -25,
    left: -5,
  },
  titleText: {
    color: GRAY,
    fontSize: 15,
    fontFamily: DM_SANS.BOLD,
  },
  titleTextSmall: {
    fontSize: 13,
  },
})
