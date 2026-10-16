import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { PressableButton } from '@/components'
import { DriveStat } from '@/screens/drive/components'
import { useDriveViewModel } from '@/screens/drive/view-model'
import { formatClock, formatDuration, formatKm, toKmh } from '@/utils'
import { DARK, DARK_LIGHT, GRAY, RED, WHITE } from '@/theme/color'
import { DM_MONO, PRETENDARD } from '@/theme/fonts'

type DrivingPanelProps = Pick<
  ReturnType<typeof useDriveViewModel>,
  'state' | 'actions'
>

// 주행 중 하단 패널: 거리, 시간, 속도, 종료 버튼
export const DrivingPanel = ({ state, actions }: DrivingPanelProps) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: bottom + 16 }]}>
      <Pressable style={styles.recenter} onPress={actions.recenterPress}>
        <FontAwesome6
          iconStyle="solid"
          name="location-crosshairs"
          size={18}
          color={WHITE}
        />
      </Pressable>
      <View style={styles.distanceRow}>
        <Text style={styles.distance}>{formatKm(state.distance)}</Text>
        <Text style={styles.distanceUnit}>km</Text>
      </View>
      {__DEV__ && (
        <Text style={styles.debug}>
          GPS ±{Math.round(state.gps.accuracy)}m · 원속도{' '}
          {state.gps.rawSpeed.toFixed(1)}m/s · 수신 {state.gps.received} · 제외{' '}
          {state.gps.dropped} · 경로점 {state.points.length}
          {!!state.gps.error && `\n오류: ${state.gps.error}`}
        </Text>
      )}
      <View style={styles.statRow}>
        <DriveStat label="주행 시간" value={formatDuration(state.elapsed)} />
        <DriveStat
          label="현재 속도"
          value={
            state.currentSpeed === null
              ? '-'
              : String(toKmh(state.currentSpeed))
          }
          unit="km/h"
        />
      </View>
      <View style={styles.statRow}>
        <DriveStat label="주행 시작" value={formatClock(state.startAt)} />
        <DriveStat
          label="평균 속도"
          value={String(toKmh(state.averageSpeed))}
          unit="km/h"
        />
      </View>
      <PressableButton
        title="주행 종료"
        onPress={actions.endPress}
        background={[RED, '#c92f2f']}
        text={[WHITE, WHITE]}
      />
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
    gap: 16,
  },
  recenter: {
    position: 'absolute',
    top: -56,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  distance: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 44,
  },
  distanceUnit: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 16,
  },
  debug: {
    color: GRAY,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 11,
    marginTop: -10,
  },
  statRow: {
    flexDirection: 'row',
    gap: 16,
  },
})
