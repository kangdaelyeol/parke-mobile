import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SLIDER_GAP } from '@home/constants'
import { useCardSize } from '@home/hooks'
import {
  EmptyCard,
  SettingCard,
  Card,
  GlassCard,
  CardSkeleton,
  EmptyView,
  PaginationDots,
  TodaySummary,
} from '@home/components'
import { useMainViewModel } from '@home/view-model'
import { HomeMainProps } from '@home/types'
import { useThemeId } from '@/theme/themed'
import { DM_SANS } from '@/theme/fonts'
import { GRAY } from '@/theme/color'

export const Main = ({ loading }: HomeMainProps) => {
  const { state, actions, animated } = useMainViewModel()
  // 카드를 아직 한 번도 못 불러온 상태에서만 뼈대를 보여준다.
  // 이미 카드가 있으면 다시 동기화하는 동안에도 기존 카드를 그대로 둔다.
  const showSkeleton = loading && state.cardLength === 0
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const isGlass = useThemeId() === 'glass-dashboard'
  // 카드 칸 크기 (글래스는 오늘의 현황 판과 같은 폭)
  const cardSize = useCardSize()
  // 수정 화면이나 카드 상세가 열리면 오늘의 현황·페이지 점은 사라지고 터치도 받지 않는다
  const hideHomeContent = state.isSetting || state.isDetail

  return (
    <View
      style={styles.container}
      onLayout={e => actions.mainLayout(e.nativeEvent.layout.height)}
    >
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
                {/* 글래스는 제목(내 기기)이 카드 유리 판 안에 있다 */}
                <Animated.View style={animated.cardTitleStyle}>
                  {isGlass ? null : (
                    <View
                      style={[classic.title, isSmall && classic.titleSmall]}
                    >
                      <Text
                        style={[
                          classic.titleText,
                          isSmall && classic.titleTextSmall,
                        ]}
                      >
                        내 기기
                      </Text>
                    </View>
                  )}
                </Animated.View>
                <View style={[styles.cardSlider, { width: cardSize.width }]}>
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
                            {/* 기본 테마: 처음 카드 + [...] 바텀시트 / 글래스: 터치하면 아래로 펼쳐지는 상세 */}
                            {isGlass ? (
                              <GlassCard card={card} idx={idx} />
                            ) : (
                              <Card card={card} idx={idx} />
                            )}
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
  cardSlider: {
    // 상세 패널이 아래 페이지 점보다 위에 그려지도록
    zIndex: 1,
  },
  cardSliderMover: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SLIDER_GAP,
  },
})

// 기본 테마 (처음 디자인)
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
