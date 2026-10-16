import { useEffect, useRef, useState } from 'react'
import { Alert, AppState, BackHandler, Linking } from 'react-native'
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { DEFAULT_CARD_CUSTOM } from '@/domain/card'
import { DriveStackNavigationProp } from '@/navigation/types'
import { permissionService } from '@/services'
import { getDistanceMeters } from '@/utils'
import {
  DriveMapHandle,
  DrivePhase,
  DriveViewModel,
  GeoPoint,
} from '@/screens/drive/types'

// 이보다 부정확한 위치는 버린다 (도심/실내에서 30~60m가 흔하다)
const MAX_ACCURACY_M = 50
// 마지막 기준점에서 이만큼은 움직여야 이동으로 인정한다 (제자리 GPS 흔들림 제거).
// 두 위치의 정확도가 나쁠수록 크게 잡되, 경로가 너무 거칠어지지 않게 상한을 둔다.
const MIN_SEGMENT_M = 8
const MAX_SEGMENT_THRESHOLD_M = 25
// 이보다 빠르게 이동한 것으로 계산되면 GPS 튐으로 보고 버린다 (약 250km/h)
const MAX_SPEED_MPS = 70
// 속도를 직접 계산할 때 필요한 최소 시간 간격 (짧으면 값이 튄다)
const MIN_SPEED_SAMPLE_S = 2
// 이 시간 동안 위치가 갱신되지 않으면 멈춘 것으로 보고 현재 속도를 0으로 표시한다
const SPEED_STALE_MS = 5 * 1000

type Anchor = GeoPoint & { accuracy: number }

// 위치 추적 디버깅용 로그 (개발 빌드에서만). Metro 콘솔에서 [Drive]로 검색
const log = (...args: unknown[]) => {
  if (!__DEV__) return
  const t = new Date().toISOString().slice(11, 23)
  // 객체는 문자열로 펼쳐서, 복사해 붙여도 값이 보이게 한다
  const text = args
    .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
    .join(' ')
  console.log(`[Drive ${t}] ${text}`)
}
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d

export const useDriveViewModel = (cardId: string): DriveViewModel => {
  const navigation = useNavigation<DriveStackNavigationProp>()
  const { cards, user } = useUserContext()
  const card = cards.find(c => c.id === cardId)

  const [phase, setPhase] = useState<DrivePhase>('driving')
  const [startAt] = useState(() => Date.now())
  const [endAt, setEndAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [distance, setDistance] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null)
  const [maxSpeed, setMaxSpeed] = useState(0)
  const [gps, setGps] = useState({
    accuracy: 0,
    rawSpeed: -1,
    received: 0,
    dropped: 0,
    error: '',
  })
  // 지도에 표시할 현재 위치 (경로 필터와 관계없이 매번 갱신)
  const [current, setCurrent] = useState<GeoPoint | null>(null)
  // 거리 계산의 기준이 되는 마지막 확정 위치
  const anchor = useRef<Anchor | null>(null)
  const lastFixAt = useRef(0)
  const mapRef = useRef<DriveMapHandle>(null)

  // 현재 시각 / 주행 시간 갱신
  const received = useRef(0)
  useEffect(() => {
    if (phase !== 'driving') return
    let tick = 0
    const id = setInterval(() => {
      setNow(Date.now())
      // 5초마다 생존 신호: 마지막 위치 이후 얼마나 지났는지
      if (++tick % 5 === 0)
        log('heartbeat', {
          received: received.current,
          sinceLastFixMs: lastFixAt.current
            ? Date.now() - lastFixAt.current
            : null,
          appState: AppState.currentState,
        })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  // 앱이 백그라운드로 가면 포그라운드 전용 추적이 멈추므로 기록해 둔다
  useEffect(() => {
    log('screen mount', { cardId, appState: AppState.currentState })
    const sub = AppState.addEventListener('change', state =>
      log('AppState ->', state),
    )
    return () => {
      log('screen unmount')
      sub.remove()
    }
  }, [cardId])

  // 주행 중 위치 추적 (포그라운드)
  useEffect(() => {
    log('tracking effect run', { phase })
    if (phase !== 'driving') return
    let watchId: number | null = null
    let cancelled = false

    const onPosition = ({ coords, timestamp }: GeolocationResponse) => {
      received.current += 1
      log(`fix #${received.current}`, {
        lat: round(coords.latitude, 6),
        lng: round(coords.longitude, 6),
        acc: round(coords.accuracy),
        speed: coords.speed,
        ageMs: Date.now() - timestamp,
      })
      if (coords.accuracy > MAX_ACCURACY_M) {
        log('  -> drop: accuracy >', MAX_ACCURACY_M)
        setGps(g => ({
          ...g,
          accuracy: coords.accuracy,
          received: g.received + 1,
          dropped: g.dropped + 1,
        }))
        return
      }
      setGps(g => ({
        ...g,
        accuracy: coords.accuracy,
        rawSpeed: coords.speed ?? -1,
        received: g.received + 1,
      }))
      lastFixAt.current = Date.now()

      // iOS/Android가 주는 속도는 위치 차이로 계산한 값보다 정확하다 (없으면 -1/null)
      const nativeSpeed =
        coords.speed !== null && coords.speed >= 0 ? coords.speed : null
      const point: Anchor = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
        speed: nativeSpeed,
        accuracy: coords.accuracy,
      }
      setCurrent(point)

      const prev = anchor.current
      if (!prev) {
        log('  -> first fix: set anchor')
        anchor.current = point
        setPoints([point])
        setCurrentSpeed(nativeSpeed ?? 0)
        return
      }

      const meters = getDistanceMeters(prev, point)
      const seconds = (timestamp - prev.timestamp) / 1000
      const threshold = Math.max(
        MIN_SEGMENT_M,
        Math.min((prev.accuracy + point.accuracy) / 2, MAX_SEGMENT_THRESHOLD_M),
      )

      // 기준점에서 충분히 멀어지기 전에는 흔들림으로 보고 거리에 넣지 않는다.
      // 기준점은 그대로 두므로 천천히 움직여도 누적되면 결국 반영된다.
      if (meters < threshold) {
        log('  -> below threshold (jitter)', {
          meters: round(meters),
          threshold: round(threshold),
        })
        if (nativeSpeed !== null) setCurrentSpeed(nativeSpeed)
        return
      }
      if (seconds > 0 && meters / seconds > MAX_SPEED_MPS) {
        log('  -> drop: jump', { meters: round(meters), seconds })
        return
      }

      const segmentSpeed =
        seconds >= MIN_SPEED_SAMPLE_S ? meters / seconds : null
      const speed = nativeSpeed ?? segmentSpeed

      log('  -> accepted segment', {
        meters: round(meters),
        seconds: round(seconds),
        speed: speed === null ? null : round(speed),
      })
      anchor.current = point
      setDistance(d => d + meters)
      setPoints(ps => [...ps, point])
      if (speed !== null) {
        setCurrentSpeed(speed)
        setMaxSpeed(m => Math.max(m, speed))
      }
    }

    ;(async () => {
      const granted = await permissionService.ensureLocationPermission()
      log('location permission', { granted, cancelled })
      if (cancelled) return
      if (!granted) {
        Alert.alert(
          '위치 권한 필요',
          '주행 경로를 기록하려면 위치 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel', onPress: navigation.goBack },
            {
              text: '설정으로 이동',
              onPress: () => {
                Linking.openSettings()
                navigation.goBack()
              },
            },
          ],
        )
        return
      }

      Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'whenInUse',
        locationProvider: 'auto',
      })
      watchId = Geolocation.watchPosition(
        onPosition,
        e => {
          log('location error', e)
          setGps(g => ({ ...g, error: `${e.code} ${e.message}` }))
        },
        {
          enableHighAccuracy: true,
          // 거리 필터는 위에서 직접 하므로 위치는 자주 받는다 (속도/정지 판단용)
          distanceFilter: 2,
          interval: 1000,
          fastestInterval: 1000,
        },
      )
      log('watchPosition started', { watchId })
    })()

    return () => {
      log('tracking cleanup', { watchId })
      cancelled = true
      if (watchId !== null) Geolocation.clearWatch(watchId)
    }
  }, [phase, navigation])

  const endPress = () => {
    Alert.alert('주행 종료', '주행을 종료하고 기록을 확인할까요?', [
      { text: '계속 주행', style: 'cancel' },
      {
        text: '종료',
        style: 'destructive',
        onPress: () => {
          const end = Date.now()
          log('drive end pressed')
          setEndAt(end)
          setNow(end)
          setPhase('summary')
        },
      },
    ])
  }

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
  const isStale = now - lastFixAt.current > SPEED_STALE_MS
  const averageSpeed = elapsed > 0 ? distance / (elapsed / 1000) : 0

  return {
    state: {
      phase,
      cardTitle: card?.title ?? 'Parke',
      driverName: user?.nickname || '운전자',
      accent: card?.custom.accent ?? DEFAULT_CARD_CUSTOM.accent,
      points,
      current,
      hasLocation: current !== null,
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
    },
    actions: {
      endPress,
      recenterPress: () => mapRef.current?.recenter(),
      // TODO: 운행일지 이메일 발송 (백엔드 설계 후 연결)
      emailPress: () =>
        Alert.alert('준비 중', '운행일지 이메일 발송은 곧 지원될 예정입니다.'),
      donePress: () => navigation.goBack(),
    },
  }
}
