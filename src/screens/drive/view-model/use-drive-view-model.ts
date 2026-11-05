import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, AppState, BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake'
import { useUserContext } from '@/contexts'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { DriveStackNavigationProp } from '@/navigation/types'
import {
  driveRecordService,
  driveSessionService,
  legalService,
} from '@/services'
import { LOCATION_CONSENT_DOCS } from '@/constants'
import { DocType } from '@/types/common'
import { DriveSessionStatus } from '@/services/types'
import { toKmh } from '@/utils'
import {
  DriveMapHandle,
  DrivePhase,
  DriveViewModel,
} from '@/screens/drive/types'
import { driveLog } from './drive-log'
import { useDriveReport } from './use-drive-report'
import { useLocationTracking } from './use-location-tracking'

// 이 시간 동안 위치가 갱신되지 않으면 멈춘 것으로 보고 현재 속도를 0으로 표시한다
const SPEED_STALE_MS = 5 * 1000
// 위치가 이 시간 동안 안 오거나 정확도가 이보다 나쁘면 'GPS 신호 약함'을 표시한다
const WEAK_SIGNAL_STALE_MS = 10 * 1000
const WEAK_SIGNAL_ACCURACY_M = 30
// 잠금화면(Live Activity) / Android 상시 알림 갱신 간격
const LOCK_SCREEN_UPDATE_MS = 5 * 1000

// 주행 모드 화면: 위치 동의 → 주행(위치 추적은 useLocationTracking) → 요약(기록 저장, 보내기는 useDriveReport)
export const useDriveViewModel = (cardId?: string): DriveViewModel => {
  const navigation = useNavigation<DriveStackNavigationProp>()
  const { cards, user, actions: userContextActions } = useUserContext()
  const [agreeing, setAgreeing] = useState(false)
  const card = cards.find(c => c.id === cardId)

  // 위치기반서비스 약관 + 개인위치정보 동의가 없거나 예전 시행일 기준이면 동의부터 받는다.
  // 동의하지 않으면 주행 모드를 시작할 수 없다
  const [phase, setPhase] = useState<DrivePhase>(() =>
    legalService.hasLocationConsent(user?.consents) ? 'driving' : 'consent',
  )
  const [startAt, setStartAt] = useState(() => Date.now())
  const [endAt, setEndAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const mapRef = useRef<DriveMapHandle>(null)
  // 위치 추적 effect가 카드 정보 변경으로 다시 실행되지 않도록 ref로 읽는다
  const cardRef = useRef({ title: 'Parke', accent: DEFAULT_CARD_CUSTOM.accent })
  cardRef.current = {
    title: card?.title ?? 'Parke',
    accent: card?.custom.accent ?? DEFAULT_CARD_CUSTOM.accent,
  }

  // 현재 시각 / 주행 시간 갱신
  useEffect(() => {
    if (phase !== 'driving') return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [phase])

  // 앱이 백그라운드로 가면 포그라운드 전용 추적이 멈추므로 기록해 둔다
  useEffect(() => {
    driveLog('screen mount', { cardId, appState: AppState.currentState })
    const sub = AppState.addEventListener('change', state =>
      driveLog('AppState ->', state),
    )
    return () => {
      driveLog('screen unmount')
      sub.remove()
    }
  }, [cardId])

  // 주행 중 위치 추적 → 경로·거리·속도
  const { points, distance, currentSpeed, maxSpeed, gps, current, lastFixAt } =
    useLocationTracking({ phase, startAt, cardRef })

  // 주행 중에는 화면이 꺼지지 않게 한다 (거치해 두고 보는 용도)
  useEffect(() => {
    if (phase !== 'driving') return
    activateKeepAwake()
    return () => deactivateKeepAwake()
  }, [phase])

  const finishDrive = useCallback(() => {
    const end = Date.now()
    driveLog('drive finished')
    setEndAt(end)
    setNow(end)
    setPhase('summary')
  }, [])

  const endPress = () => {
    Alert.alert('주행 종료', '주행을 종료하고 기록을 확인할까요?', [
      { text: '계속 주행', style: 'cancel' },
      { text: '종료', style: 'destructive', onPress: finishDrive },
    ])
  }

  // Android 상시 알림의 [주행 종료] (잠금화면에서도 누를 수 있다)
  useEffect(() => {
    if (phase !== 'driving') return
    return driveSessionService.onEndRequest(finishDrive)
  }, [phase, finishDrive])

  // Android 뒤로가기로 주행이 끊기지 않게, 주행 중에는 종료 확인을 띄운다
  useEffect(() => {
    if (phase !== 'driving') return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      endPress()
      return true
    })
    return () => sub.remove()
  })

  const elapsed = (endAt ?? now) - startAt
  const sinceLastFix = now - lastFixAt.current
  const isStale = sinceLastFix > SPEED_STALE_MS
  const weakSignal =
    phase === 'driving' &&
    current !== null &&
    (sinceLastFix > WEAK_SIGNAL_STALE_MS ||
      gps.accuracy > WEAK_SIGNAL_ACCURACY_M)
  const averageSpeed = elapsed > 0 ? distance / (elapsed / 1000) : 0

  // 주행이 끝나면 카드에 주행 기록을 한 번 저장한다.
  // 카드 없이 시작한 테스트 주행이나 위치를 한 번도 받지 못한 주행은 저장하지 않는다
  const recordRef = useRef({ points, distance, averageSpeed, maxSpeed })
  recordRef.current = { points, distance, averageSpeed, maxSpeed }
  const recordSaved = useRef(false)
  useEffect(() => {
    if (phase !== 'summary' || recordSaved.current) return
    recordSaved.current = true
    const record = recordRef.current
    if (!user || !card || record.points.length === 0) {
      driveLog('record not saved', {
        hasCard: !!card,
        points: record.points.length,
      })
      return
    }
    driveRecordService
      .save(user.id, {
        cardId: card.id,
        cardTitle: card.title,
        startAt,
        endAt: endAt ?? Date.now(),
        distance: record.distance,
        averageSpeed: record.averageSpeed,
        maxSpeed: record.maxSpeed,
        points: record.points,
      })
      .then(res => {
        if (!res.status)
          Alert.alert('주행 기록을 저장하지 못했어요', res.message)
      })
  }, [phase, user, card, startAt, endAt])

  // 잠금화면 / 상시 알림 내용은 몇 초마다만 갱신한다 (iOS 갱신 횟수 제한, 배터리)
  const statusRef = useRef<DriveSessionStatus | null>(null)
  statusRef.current = {
    distance,
    elapsed,
    speedKmh: toKmh(isStale || currentSpeed === null ? 0 : currentSpeed),
    averageSpeedKmh: toKmh(averageSpeed),
    weakSignal,
  }
  useEffect(() => {
    if (phase !== 'driving') return
    const id = setInterval(() => {
      if (statusRef.current) driveSessionService.update(statusRef.current)
    }, LOCK_SCREEN_UPDATE_MS)
    return () => clearInterval(id)
  }, [phase])

  // 운행 기록 보내기 (요약 화면)
  const report = useDriveReport({
    card,
    user,
    mapRef,
    summary: {
      startAt,
      endAt: endAt ?? now,
      distance,
      averageSpeed,
      maxSpeed,
      points,
    },
  })

  return {
    state: {
      phase,
      cardTitle: card?.title ?? 'Parke',
      driverName: user?.nickname || '운전자',
      accent: card?.custom.accent ?? DEFAULT_CARD_CUSTOM.accent,
      points,
      current,
      hasLocation: current !== null,
      weakSignal,
      now,
      startAt,
      endAt,
      elapsed,
      distance,
      currentSpeed: isStale && currentSpeed !== null ? 0 : currentSpeed,
      averageSpeed,
      maxSpeed,
      gps,
      mapRef,
      agreeing,
      ...report.state,
    },
    actions: {
      agreeLocationPress: async () => {
        if (!user || agreeing) return
        setAgreeing(true)
        const res = await legalService.recordConsents(
          user.id,
          LOCATION_CONSENT_DOCS,
          true,
        )
        setAgreeing(false)
        if (!res.status) {
          Alert.alert(res.message)
          return
        }
        userContextActions.setConsents(res.payload)
        // 주행 시작 시각은 동의한 순간부터
        const start = Date.now()
        setStartAt(start)
        setNow(start)
        setPhase('driving')
      },
      showDocPress: (docType: DocType) =>
        navigation.navigate('LegalDoc', { docType }),
      endPress,
      recenterPress: () => mapRef.current?.recenter(),
      donePress: () => navigation.goBack(),
      ...report.actions,
    },
  }
}
