import { ReactNode, useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { CARD_FRAME_PADDING, CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { DETAIL_GAP } from '@home/contexts'
import { useCardDetailViewModel } from '@home/view-model'
import { CardDetailTab, HomeCardProps } from '@home/types'
import {
  IconTile,
  Loading,
  PressableButton,
  SegmentedControl,
  SegmentOption,
  SolidIconName,
  StatusPill,
  Toggle as GlassToggle,
} from '@/components'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { formatPhone } from '@/utils'
import { PRETENDARD } from '@/theme/fonts'
import { GLASS, glassStyles, TEXT, TONE, withAlpha } from '@/theme/glass'

const ROW_HEIGHT = 52
// 상세 창이 판 바깥으로 남겨 두는 여유 (버튼 빛 그림자 자리)
const PANEL_GLOW_SPACE = 24

const TABS: readonly SegmentOption<CardDetailTab>[] = [
  { key: 'info', label: '카드 정보' },
  { key: 'manage', label: '관리' },
]

// 카드 면: 왼쪽 아래는 검정, 오른쪽 위로 갈수록 카드 강조색. 그 위에 대각선 광택을 한 겹 더 얹는다
const cardFace = (accent: string) =>
  [
    'linear-gradient(150deg, rgba(255,255,255,0) 22%, rgba(255,235,255,0.26) 40%, rgba(255,255,255,0) 60%)',
    `linear-gradient(55deg, #050505 30%, ${withAlpha(
      accent,
      0.55,
    )} 72%, ${withAlpha(accent, 0.95)} 100%)`,
  ].join(', ')

interface DetailRowProps {
  index: number
  progress: SharedValue<number>
  icon: SolidIconName
  color: string
  title: string
  value?: string
  right?: ReactNode
  danger?: boolean
  last?: boolean
  onPress?: () => void
}

// 상세 한 줄. 패널이 펼쳐질 때 위에서부터 차례로 나타난다
const DetailRow = ({
  index,
  progress,
  icon,
  color,
  title,
  value,
  right,
  danger,
  last,
  onPress,
}: DetailRowProps) => {
  const style = useAnimatedStyle(() => {
    const start = 0.35 + index * 0.08
    const t = interpolate(
      progress.value,
      [start, start + 0.35],
      [0, 1],
      'clamp',
    )
    return { opacity: t, transform: [{ translateY: (1 - t) * 8 }] }
  })

  return (
    <Animated.View style={style}>
      <Animated.View entering={FadeIn.duration(220).delay(index * 35)}>
        <Pressable onPress={onPress} disabled={!onPress}>
          {({ pressed }) => (
            <View
              style={[
                styles.row,
                !last && styles.rowDivider,
                pressed && glassStyles.pressed,
              ]}
            >
              <IconTile icon={icon} color={color} size={30} />
              <Text
                style={[styles.rowTitle, danger && styles.dangerText]}
                numberOfLines={1}
              >
                {title}
              </Text>
              {value !== undefined && (
                <Text style={styles.rowValue} numberOfLines={1}>
                  {value}
                </Text>
              )}
              {right}
              {onPress && !right && (
                <FontAwesome6
                  name="chevron-right"
                  iconStyle="solid"
                  size={11}
                  color={TEXT.faint}
                />
              )}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

// 유리 카드: 터치하면 아래로 상세(카드 정보 / 관리)가 펼쳐진다. 기존 바텀시트 기능을 모두 담는다
export const GlassCard = ({ card, idx }: HomeCardProps) => {
  const { state, actions, animated } = useCardDetailViewModel(idx)
  const accent = card.custom.accent || DEFAULT_CARD_CUSTOM.accent
  const faceStyle = useMemo(
    () => ({ experimental_backgroundImage: cardFace(accent) }),
    [accent],
  )
  const { progress } = animated

  return (
    <Animated.View style={[styles.root, animated.cardStyle]}>
      <View style={[glassStyles.surface, styles.frame]}>
        {state.loading && <Loading />}
        <Pressable onPress={actions.togglePress}>
          <View style={[styles.face, faceStyle]}>
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
              <Pressable onPress={actions.previewPress} hitSlop={6}>
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
              <Pressable onPress={actions.togglePress} hitSlop={6}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.glassButton,
                      styles.pillButton,
                      pressed && styles.glassButtonPressed,
                    ]}
                  >
                    <Text style={styles.pillButtonText}>
                      {state.open ? '접기' : '자세히'}
                    </Text>
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

      {/* 상세: 카드 바로 아래 창 안에서 위에서 아래로 미끄러져 나온다.
          크기를 바꾸지 않고 위치(transform)만 움직여 매 프레임 레이아웃을 다시 계산하지 않는다 */}
      <View
        style={styles.panelClip}
        pointerEvents={state.open ? 'box-none' : 'none'}
      >
        <Animated.View
          style={[glassStyles.surface, styles.panel, animated.panelStyle]}
          onLayout={e => actions.panelLayout(e.nativeEvent.layout.height)}
        >
          <SegmentedControl
            options={TABS}
            value={state.tab}
            onChange={actions.tabPress}
          />

          {state.tab === 'info' ? (
            <View key="info">
              <DetailRow
                index={0}
                progress={progress}
                icon="phone"
                color={TONE.info}
                title="전화번호"
                value={formatPhone(card.phone) || '없음'}
              />
              <DetailRow
                index={1}
                progress={progress}
                icon="comment"
                color={TONE.violet}
                title="메시지"
                value={card.custom.message || '없음'}
              />
              <DetailRow
                index={2}
                progress={progress}
                icon="envelope"
                color={TONE.warning}
                title="운행 기록 이메일"
                value={card.email || '설정 안 됨'}
              />
              <DetailRow
                index={3}
                progress={progress}
                icon="signal"
                color={TONE.success}
                title="자동감지"
                right={
                  <StatusPill
                    variant="plain"
                    dot
                    tone={card.scan ? 'success' : 'danger'}
                    label={card.scan ? 'On' : 'Off'}
                  />
                }
              />
              <DetailRow
                index={4}
                progress={progress}
                icon="hashtag"
                color={TONE.neutral}
                title="기기 번호"
                value={card.id}
                last
              />
            </View>
          ) : (
            <View key="manage">
              <DetailRow
                index={0}
                progress={progress}
                icon="signal"
                color={TONE.success}
                title="자동감지"
                right={
                  <GlassToggle
                    value={card.scan}
                    onValueChange={actions.scanChange}
                  />
                }
              />
              <DetailRow
                index={1}
                progress={progress}
                icon="arrows-rotate"
                color={TONE.violet}
                title="내 번호로 변경"
                onPress={actions.changePhonePress}
              />
              <DetailRow
                index={2}
                progress={progress}
                icon="route"
                color={TONE.info}
                title="주행 기록 보기"
                onPress={actions.recordsPress}
              />
              <DetailRow
                index={3}
                progress={progress}
                icon="pen"
                color={TONE.warning}
                title="카드 수정"
                onPress={actions.editPress}
              />
              <DetailRow
                index={4}
                progress={progress}
                icon="trash-can"
                color={TONE.danger}
                title="카드 삭제"
                danger
                last
                onPress={actions.deletePress}
              />
            </View>
          )}

          <PressableButton
            icon="car-side"
            title="주행모드"
            onPress={actions.drivePress}
            style={styles.driveButton}
          />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: CARD_WIDTH,
    marginHorizontal: 'auto',
  },
  frame: {
    padding: CARD_FRAME_PADDING,
    borderRadius: 28,
  },
  // 테두리 판(안쪽 여백 + 테두리 1)이 정확히 CARD_HEIGHT가 되도록
  face: {
    height: CARD_HEIGHT - (CARD_FRAME_PADDING + 1) * 2,
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
  pillButton: {
    paddingHorizontal: 14,
  },
  pillButtonText: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
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
  // 상세 창: 높이는 안의 판 크기 그대로, 창 위로 나간 부분(올라가 있는 판)은 잘린다.
  // 주행모드 버튼의 빛 그림자가 잘리지 않도록 양옆·아래로 여유를 둔다
  panelClip: {
    position: 'absolute',
    top: CARD_HEIGHT + DETAIL_GAP,
    left: -PANEL_GLOW_SPACE,
    right: -PANEL_GLOW_SPACE,
    paddingHorizontal: PANEL_GLOW_SPACE,
    paddingBottom: PANEL_GLOW_SPACE,
    overflow: 'hidden',
  },
  // 카드와 따로 떨어진 유리 판 (영상의 카드들처럼 틈을 두고 놓인다)
  panel: {
    borderRadius: 24,
    padding: 10,
    gap: 6,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS.divider,
  },
  rowTitle: {
    flex: 1,
    color: TEXT.strong,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
  },
  rowValue: {
    maxWidth: '50%',
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  dangerText: {
    color: TONE.danger,
  },
  driveButton: {
    marginTop: 4,
    minHeight: 46,
  },
})
