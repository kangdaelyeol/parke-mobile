import { ComponentProps, ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  FadeIn,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useCardDetailViewModel } from '@home/view-model'
import { HomeCardProps } from '@home/types'
import { Loading, Toggle as GlassToggle } from '@/components'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { formatPhone } from '@/utils'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GRAY, GREEN, RED, RED_LIGHT, WHITE } from '@/theme/color'
import { GLASS, glassStyles, withAlpha } from '@/theme/glass'

type IconName = Extract<
  ComponentProps<typeof FontAwesome6>,
  { iconStyle: 'solid' }
>['name']

const FRAME_PADDING = 5
const ROW_HEIGHT = 52

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
  icon: IconName
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
              <View
                style={[
                  styles.rowIcon,
                  {
                    backgroundColor: withAlpha(color, 0.14),
                    borderColor: withAlpha(color, 0.28),
                  },
                ]}
              >
                <FontAwesome6
                  name={icon}
                  iconStyle="solid"
                  size={13}
                  color={color}
                />
              </View>
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
                  color={GRAY}
                />
              )}
            </View>
          )}
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const StatusPill = ({ on }: { on: boolean }) => {
  const color = on ? GREEN : RED
  return (
    <View style={[styles.pill, { backgroundColor: withAlpha(color, 0.14) }]}>
      <Text style={[styles.pillText, { color }]}>{on ? 'On' : 'Off'}</Text>
    </View>
  )
}

// 유리 카드: 터치하면 아래로 상세(카드 정보 / 관리)가 펼쳐진다. 기존 바텀시트 기능을 모두 담는다
export const GlassCard = ({ card, idx }: HomeCardProps) => {
  const { state, actions, animated } = useCardDetailViewModel(idx)
  const accent = card.custom.accent || DEFAULT_CARD_CUSTOM.accent
  const { progress } = animated

  return (
    <Animated.View
      style={[glassStyles.field, styles.frame, animated.cardStyle]}
    >
      {state.loading && <Loading />}
      <Pressable onPress={actions.togglePress}>
        <View
          style={[
            styles.face,
            { experimental_backgroundImage: cardFace(accent) },
          ]}
        >
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
                    color={WHITE}
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
                style={[styles.scanText, { color: card.scan ? GREEN : RED }]}
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

      <Animated.View
        style={[styles.panel, animated.panelStyle]}
        pointerEvents={state.open ? 'auto' : 'none'}
      >
        <View
          style={styles.panelContent}
          onLayout={e => actions.panelLayout(e.nativeEvent.layout.height)}
        >
          <View
            style={styles.segment}
            onLayout={e => actions.segmentLayout(e.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[styles.segmentIndicator, animated.indicatorStyle]}
            />
            {(
              [
                ['info', '카드 정보'],
                ['manage', '관리'],
              ] as const
            ).map(([key, label]) => (
              <Pressable
                key={key}
                style={styles.segmentTab}
                onPress={() => actions.tabPress(key)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    state.tab === key && styles.segmentTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {state.tab === 'info' ? (
            <View key="info">
              <DetailRow
                index={0}
                progress={progress}
                icon="phone"
                color="#92b3ff"
                title="전화번호"
                value={formatPhone(card.phone) || '없음'}
              />
              <DetailRow
                index={1}
                progress={progress}
                icon="comment"
                color="#c4a1ff"
                title="메시지"
                value={card.custom.message || '없음'}
              />
              <DetailRow
                index={2}
                progress={progress}
                icon="envelope"
                color="#ffb84d"
                title="운행 기록 이메일"
                value={card.email || '설정 안 됨'}
              />
              <DetailRow
                index={3}
                progress={progress}
                icon="signal"
                color="#34d399"
                title="자동감지"
                right={<StatusPill on={card.scan} />}
              />
              <DetailRow
                index={4}
                progress={progress}
                icon="hashtag"
                color={GRAY}
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
                color="#34d399"
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
                color="#e8f060"
                title="내 번호로 변경"
                onPress={actions.changePhonePress}
              />
              <DetailRow
                index={2}
                progress={progress}
                icon="route"
                color="#ffcf5a"
                title="주행 기록 보기"
                onPress={actions.recordsPress}
              />
              <DetailRow
                index={3}
                progress={progress}
                icon="pen"
                color="#9db4ff"
                title="카드 수정"
                onPress={actions.editPress}
              />
              <DetailRow
                index={4}
                progress={progress}
                icon="trash-can"
                color={RED_LIGHT}
                title="카드 삭제"
                danger
                last
                onPress={actions.deletePress}
              />
            </View>
          )}

          <Pressable onPress={actions.drivePress}>
            {({ pressed }) => (
              <View
                style={[
                  glassStyles.field,
                  styles.driveButton,
                  pressed && glassStyles.fieldFocused,
                ]}
              >
                <FontAwesome6
                  name="car-side"
                  iconStyle="solid"
                  size={14}
                  color={WHITE}
                />
                <Text style={styles.driveText}>주행모드</Text>
              </View>
            )}
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  frame: {
    width: CARD_WIDTH,
    marginHorizontal: 'auto',
    padding: FRAME_PADDING,
    borderRadius: 28,
    boxShadow: '0px 12px 32px rgba(0,0,0,0.55)',
  },
  face: {
    height: CARD_HEIGHT - FRAME_PADDING * 2,
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
    color: WHITE,
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
    color: WHITE,
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
    color: WHITE,
    fontFamily: PRETENDARD.REGULAR,
    fontSize: 32,
    letterSpacing: -0.5,
  },
  scan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },
  scanText: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: GREEN,
    boxShadow: `0px 0px 6px ${GREEN}`,
  },
  dotOff: {
    backgroundColor: RED,
  },
  panel: {
    borderRadius: 23,
    backgroundColor: 'rgba(14,14,14,0.92)',
    borderWidth: 1,
    borderColor: GLASS.border,
    overflow: 'hidden',
  },
  panelContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    gap: 6,
  },
  segment: {
    flexDirection: 'row',
    height: 38,
    padding: 4,
    borderRadius: 12,
    backgroundColor: GLASS.fill,
  },
  segmentIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  segmentTextActive: {
    color: WHITE,
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
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
  },
  rowValue: {
    maxWidth: '50%',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  dangerText: {
    color: RED_LIGHT,
  },
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    fontFamily: DM_SANS.BOLD,
    fontSize: 12,
  },
  driveButton: {
    marginTop: 4,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  driveText: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
})
