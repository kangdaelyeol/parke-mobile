import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { CARD_FRAME_HEADER, CARD_FRAME_PADDING } from '@home/constants'
import { useCardSize } from '@home/hooks'
import { useCardSliderContext } from '@home/contexts'
import { useCardViewModel } from '@home/view-model'
import { HomeCardProps } from '@home/types'
import { SectionLabel } from '@/components'
import { useUserContext } from '@/contexts'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { formatPhone } from '@/utils'
import { PRETENDARD } from '@/theme/fonts'
import { glassStyles, TEXT, TONE, withAlpha } from '@/theme/glass'
import { CardSlotDots } from './card-slot-dots'

// 카드 면: 왼쪽 아래는 검정, 오른쪽 위로 갈수록 카드 강조색. 그 위에 대각선 광택을 한 겹 더 얹는다
const cardFace = (accent: string) =>
  [
    'linear-gradient(150deg, rgba(255,255,255,0) 22%, rgba(255,235,255,0.26) 40%, rgba(255,255,255,0) 60%)',
    `linear-gradient(55deg, #050505 30%, ${withAlpha(
      accent,
      0.55,
    )} 72%, ${withAlpha(accent, 0.95)} 100%)`,
  ].join(', ')

// 유리 카드 (내 기기 판): 카드 면만 담는다. 카드 정보·관리는 아래 카드 정보 판에 늘 펼쳐져 있다
export const GlassCard = ({ card, idx }: HomeCardProps) => {
  const { actions, animated } = useCardViewModel(idx)
  const { isSliding } = useCardSliderContext()
  const { cards } = useUserContext()
  const accent = card.custom.accent || DEFAULT_CARD_CUSTOM.accent
  const faceStyle = useMemo(
    () => ({ experimental_backgroundImage: cardFace(accent) }),
    [accent],
  )
  // 카드 크기 (오늘의 현황과 같은 폭). 테두리 판(안쪽 여백 + 테두리 1 + 제목 줄)이 정확히 카드 높이가 되도록 카드 면 높이를 정한다
  const { width, height } = useCardSize()
  const sizeStyles = useMemo(
    () => ({
      root: { width },
      face: {
        height: height - (CARD_FRAME_PADDING + 1) * 2 - CARD_FRAME_HEADER,
      },
    }),
    [width, height],
  )
  // 넘기는 중(또는 막 넘긴 직후)의 누름은 무시한다
  const previewPress = () => {
    if (!isSliding()) actions.previewPress()
  }

  return (
    <Animated.View style={[styles.root, sizeStyles.root, animated.cardStyle]}>
      <View style={[glassStyles.surface, styles.frame]}>
        {/* 판 제목 + 오른쪽에 이 카드가 몇 번째 칸인지 */}
        <View style={styles.frameHeader}>
          <SectionLabel>내 기기</SectionLabel>
          <CardSlotDots count={cards.length + 1} index={idx} />
        </View>
        {/* 고르지 않은 카드를 누르면 그 카드로 넘긴다 */}
        <Pressable onPress={actions.cardPress}>
          <View style={[styles.face, sizeStyles.face, faceStyle]}>
            <View style={styles.faceTop}>
              <View style={styles.faceTitle}>
                <Text style={styles.title} numberOfLines={1}>
                  {card.title}
                </Text>
                {!!card.custom.message && (
                  <Text style={styles.message} numberOfLines={1}>
                    {card.custom.message}
                  </Text>
                )}
              </View>
              <Pressable onPress={previewPress} hitSlop={6}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.glassButton,
                      styles.circleButton,
                      pressed && styles.glassButtonPressed,
                    ]}
                  >
                    <FontAwesome6
                      name="eye"
                      iconStyle="solid"
                      size={13}
                      color={TEXT.primary}
                    />
                  </View>
                )}
              </Pressable>
            </View>
            <View style={styles.faceBottom}>
              <Text style={styles.phone} numberOfLines={1}>
                {formatPhone(card.phone)}
              </Text>
              <View style={styles.scan}>
                <Text
                  style={[
                    styles.scanText,
                    card.scan ? styles.scanTextOn : styles.scanTextOff,
                  ]}
                >
                  {card.scan ? '자동감지' : '감지 꺼짐'}
                </Text>
                {card.scan ? (
                  <Animated.View
                    style={[styles.dot, styles.dotOn, animated.scanOnDotStyle]}
                  />
                ) : (
                  <View style={[styles.dot, styles.dotOff]} />
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 'auto',
  },
  frame: {
    padding: CARD_FRAME_PADDING,
    borderRadius: 28,
  },
  frameHeader: {
    height: CARD_FRAME_HEADER,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  face: {
    borderRadius: 23,
    backgroundColor: '#050505',
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  faceTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  faceTitle: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 18,
  },
  message: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  glassButton: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderTopColor: 'rgba(255,255,255,0.32)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  circleButton: {
    width: 36,
  },
  faceBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  phone: {
    flexShrink: 1,
    color: TEXT.primary,
    fontFamily: PRETENDARD.REGULAR,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  // 자동감지 상태는 오른쪽 아래 끝에 붙인다
  scan: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },
  scanText: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
  scanTextOn: {
    color: TONE.success,
  },
  scanTextOff: {
    color: TONE.danger,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: TONE.success,
    boxShadow: `0px 0px 6px ${TONE.success}`,
  },
  dotOff: {
    backgroundColor: TONE.danger,
  },
})
