import { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useCardActions } from '@home/view-model'
import { CardInfoTab, HomeCardInfoProps } from '@home/types'
import {
  IconTile,
  Loading,
  PanelHeader,
  PressableButton,
  SegmentedControl,
  SegmentOption,
  SolidIconName,
  StatusPill,
  Toggle as GlassToggle,
} from '@/components'
import { useUserContext } from '@/contexts'
import { formatPhone } from '@/utils'
import { PRETENDARD } from '@/theme/fonts'
import { GLASS, glassStyles, TEXT, TONE } from '@/theme/glass'

const TABS: readonly SegmentOption<CardInfoTab>[] = [
  { key: 'info', label: '정보' },
  { key: 'manage', label: '관리' },
]

interface InfoRowProps {
  icon: SolidIconName
  color: string
  title: string
  value?: string
  right?: ReactNode
  danger?: boolean
  onPress?: () => void
}

// 한 줄: 아이콘 타일 + 이름 + 오른쪽 끝 값 (영상 도넛 범례 줄처럼 값은 오른쪽에 붙인다)
const InfoRow = ({
  icon,
  color,
  title,
  value,
  right,
  danger,
  onPress,
}: InfoRowProps) => (
  <Pressable onPress={onPress} disabled={!onPress}>
    {({ pressed }) => (
      <View style={[styles.row, pressed && glassStyles.pressed]}>
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
)

const Divider = () => <View style={styles.divider} />

// 카드 정보 판 (글래스 홈): 위 내 기기 판에서 고른 카드의 정보와 관리 항목을 늘 펼쳐 둔다.
// 카드를 넘기면 내용이 바로 바뀐다 (영상의 페이지 전환처럼 전환 효과 없음)
export const GlassCardInfo = ({ idx, tab, onTabChange }: HomeCardInfoProps) => {
  const { cards } = useUserContext()
  const card = cards[idx]
  const { loading, actions } = useCardActions(idx)
  if (!card) return null

  return (
    <View style={[glassStyles.surface, styles.panel]}>
      <PanelHeader
        style={styles.header}
        title={card.title}
        right={
          <SegmentedControl
            options={TABS}
            value={tab}
            onChange={onTabChange}
            style={styles.tabs}
          />
        }
      />

      {tab === 'info' ? (
        <View>
          <InfoRow
            icon="phone"
            color={TONE.info}
            title="전화번호"
            value={formatPhone(card.phone) || '없음'}
          />
          <Divider />
          <InfoRow
            icon="comment"
            color={TONE.violet}
            title="메시지"
            value={card.custom.message || '없음'}
          />
          <Divider />
          <InfoRow
            icon="envelope"
            color={TONE.warning}
            title="운행 기록 이메일"
            value={card.email || '설정 안 됨'}
          />
          <Divider />
          <InfoRow
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
          <Divider />
          <InfoRow
            icon="hashtag"
            color={TONE.neutral}
            title="기기 번호"
            value={card.id}
          />
        </View>
      ) : (
        <View>
          <InfoRow
            icon="signal"
            color={TONE.success}
            title="자동감지"
            right={
              <GlassToggle
                value={card.scan}
                onValueChange={() => actions.scanChangePress()}
              />
            }
          />
          <Divider />
          <InfoRow
            icon="arrows-rotate"
            color={TONE.violet}
            title="내 번호로 변경"
            onPress={actions.changePhonePress}
          />
          <Divider />
          <InfoRow
            icon="route"
            color={TONE.info}
            title="주행 기록 보기"
            onPress={actions.recordsPress}
          />
          <Divider />
          <InfoRow
            icon="pen"
            color={TONE.warning}
            title="카드 수정"
            onPress={actions.editPress}
          />
          <Divider />
          <InfoRow
            icon="trash-can"
            color={TONE.danger}
            title="카드 삭제"
            danger
            onPress={() => actions.deletePress()}
          />
        </View>
      )}

      <PressableButton
        icon="car-side"
        title="주행모드"
        onPress={actions.drivePress}
        style={styles.driveButton}
      />
      {/* 삭제·번호 변경 중에는 판을 덮는다 (판의 둥근 모서리에 맞춰 자른다) */}
      {loading && (
        <View style={styles.loadingCover}>
          <Loading />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    padding: 10,
    paddingTop: 14,
    gap: 6,
  },
  loadingCover: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabs: {
    width: 120,
  },
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 6,
    backgroundColor: GLASS.divider,
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
