import { StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '@/navigation/types'
import {
  DriveMap,
  DriveSummary,
  DrivingPanel,
} from '@/screens/drive/components'
import { useDriveViewModel } from '@/screens/drive/view-model'
import { formatClock } from '@/utils'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { DM_MONO, DM_SANS, PRETENDARD } from '@/theme/fonts'

type DriveScreenProps = {
  route: RouteProp<RootStackParamList, 'Drive'>
}

export default function DriveScreen({ route }: DriveScreenProps) {
  const { state, actions } = useDriveViewModel(route.params.cardId)
  const { top } = useSafeAreaInsets()
  const isDriving = state.phase === 'driving'

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <DriveMap
          ref={state.mapRef}
          phase={state.phase}
          points={state.points}
          current={state.current}
          accent={state.accent}
        />
        <View style={[styles.topBar, { top: top + 10 }]}>
          <View style={styles.chip}>
            <View style={[styles.dot, { backgroundColor: state.accent }]} />
            <Text style={styles.chipTitle}>
              {isDriving ? state.cardTitle : '주행 요약'}
            </Text>
          </View>
          {isDriving && (
            <View style={styles.chip}>
              <Text style={styles.clock}>{formatClock(state.now)}</Text>
            </View>
          )}
        </View>
        {isDriving && !state.hasLocation && (
          <View style={styles.searching}>
            <Text style={styles.searchingText}>GPS 신호를 찾는 중…</Text>
          </View>
        )}
        {state.weakSignal && (
          <View style={[styles.weakSignal, { top: top + 60 }]}>
            <View style={styles.weakDot} />
            <Text style={styles.weakSignalText}>
              GPS 신호 약함 · 위치가 정확하지 않을 수 있어요
            </Text>
          </View>
        )}
      </View>
      {isDriving ? (
        <DrivingPanel state={state} actions={actions} />
      ) : (
        <DriveSummary state={state} actions={actions} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipTitle: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  clock: {
    color: WHITE,
    fontFamily: DM_MONO.MEDIUM,
    fontSize: 14,
  },
  searching: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: DARK,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  weakSignal: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DARK,
    borderWidth: 1,
    borderColor: '#5a4a1a',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  weakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb300',
  },
  weakSignalText: {
    color: '#ffcf5a',
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  searchingText: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
})
