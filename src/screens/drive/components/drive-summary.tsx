import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PressableButton } from '@/components'
import { DriveStat } from '@/screens/drive/components'
import { useDriveViewModel } from '@/screens/drive/view-model'
import { formatClock, formatDuration, formatKm, toKmh } from '@/utils'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_DEEP,
  WHITE,
} from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'

type DriveSummaryProps = Pick<
  ReturnType<typeof useDriveViewModel>,
  'state' | 'actions'
>

// 주행 종료 후 요약
export const DriveSummary = ({ state, actions }: DriveSummaryProps) => {
  const { bottom } = useSafeAreaInsets()
  const endAt = state.endAt ?? state.now

  return (
    <View style={[styles.container, { paddingBottom: bottom + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{state.cardTitle}</Text>
        <Text style={styles.subTitle}>
          {state.driverName} · {formatClock(state.startAt)} ~{' '}
          {formatClock(endAt)}
        </Text>
      </View>
      <View style={styles.statRow}>
        <DriveStat
          label="이동 거리"
          value={formatKm(state.distance)}
          unit="km"
        />
        <DriveStat label="주행 시간" value={formatDuration(state.elapsed)} />
      </View>
      <View style={styles.statRow}>
        <DriveStat
          label="평균 속도"
          value={String(toKmh(state.averageSpeed))}
          unit="km/h"
        />
        <DriveStat
          label="최고 속도"
          value={String(toKmh(state.maxSpeed))}
          unit="km/h"
        />
      </View>
      <View style={styles.buttonRow}>
        <PressableButton
          title="완료"
          onPress={actions.donePress}
          background={[DARK, DARK_LIGHT]}
          border={[DARK_LIGHT, GRAY_DEEP]}
          text={[WHITE, WHITE]}
          pressableStyle={styles.button}
        />
        <PressableButton
          title="이메일로 보내기"
          onPress={actions.emailPress}
          background={[BLUE_PRIMARY, '#1732ff']}
          text={[WHITE, WHITE]}
          pressableStyle={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: DARK_LIGHT,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 18,
  },
  header: {
    gap: 4,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 20,
  },
  subTitle: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
})
