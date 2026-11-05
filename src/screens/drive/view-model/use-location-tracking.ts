import { RefObject, useEffect, useRef, useState } from 'react'
import { Alert, AppState, Linking } from 'react-native'
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation'
import { useNavigation } from '@react-navigation/native'
import {
  evaluateFix,
  GeoPoint,
  MAX_ACCURACY_M,
  TrackPoint,
} from '@/domain/drive'
import { DriveStackNavigationProp } from '@/navigation/types'
import {
  driveSessionService,
  locationLogService,
  permissionService,
} from '@/services'
import { DrivePhase } from '@/screens/drive/types'
import { driveLog, round } from './drive-log'

interface LocationTrackingOptions {
  // 'driving'인 동안만 위치를 받는다
  phase: DrivePhase
  // 주행 시작 시각 (잠금화면 표시에 쓴다)
  startAt: number
  // 잠금화면에 보일 카드 이름·강조색. 카드 정보가 바뀌어도 추적을 다시 시작하지 않도록 ref로 받는다
  cardRef: RefObject<{ title: string; accent: string }>
}

// 주행 중 위치를 받아 경로·거리·속도를 쌓는다.
// 추적을 시작할 때 잠금화면 표시(iOS Live Activity / Android 상시 알림)를 켜고, 끝나면 끈다
export const useLocationTracking = ({
  phase,
  startAt,
  cardRef,
}: LocationTrackingOptions) => {
  const navigation = useNavigation<DriveStackNavigationProp>()
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
  const anchor = useRef<TrackPoint | null>(null)
  // 쓸 만한 위치를 마지막으로 받은 시각 (멈춤·신호 약함 판단)
  const lastFixAt = useRef(0)
  const received = useRef(0)

  // 5초마다 생존 신호: 마지막 위치 이후 얼마나 지났는지 (개발 빌드에서만)
  useEffect(() => {
    if (!__DEV__ || phase !== 'driving') return
    const id = setInterval(() => {
      driveLog('heartbeat', {
        received: received.current,
        sinceLastFixMs: lastFixAt.current
          ? Date.now() - lastFixAt.current
          : null,
        appState: AppState.currentState,
      })
    }, 5000)
    return () => clearInterval(id)
  }, [phase])

  // 주행 중 위치 추적 (포그라운드)
  useEffect(() => {
    driveLog('tracking effect run', { phase })
    if (phase !== 'driving') return
    let watchId: number | null = null
    let cancelled = false

    const onPosition = ({ coords, timestamp }: GeolocationResponse) => {
      received.current += 1
      driveLog(`fix #${received.current}`, {
        lat: round(coords.latitude, 6),
        lng: round(coords.longitude, 6),
        acc: round(coords.accuracy),
        speed: coords.speed,
        ageMs: Date.now() - timestamp,
      })
      const result = evaluateFix(anchor.current, {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        speed: coords.speed,
        timestamp,
      })
      if (result.type === 'inaccurate') {
        driveLog('  -> drop: accuracy >', MAX_ACCURACY_M)
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
        // 위치가 다시 들어오면 이전 오류는 지난 일이므로 지운다
        error: '',
      }))
      lastFixAt.current = Date.now()
      const { point } = result
      setCurrent(point)

      switch (result.type) {
        case 'first':
          driveLog('  -> first fix: set anchor')
          anchor.current = point
          setPoints([point])
          setCurrentSpeed(result.speed)
          return
        case 'jitter':
          driveLog('  -> below threshold (jitter)', {
            meters: round(result.meters),
            threshold: round(result.threshold),
          })
          if (result.speed !== null) setCurrentSpeed(result.speed)
          return
        case 'jump':
          driveLog('  -> drop: jump', {
            meters: round(result.meters),
            seconds: result.seconds,
          })
          return
        case 'accepted': {
          const { meters, speed } = result
          driveLog('  -> accepted segment', {
            meters: round(meters),
            seconds: round(result.seconds),
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
      }
    }

    ;(async () => {
      const granted = await permissionService.ensureLocationPermission()
      driveLog('location permission', { granted, cancelled })
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
        // 화면을 꺼도 이어서 기록 (iOS 위치 백그라운드 모드)
        enableBackgroundLocationUpdates: true,
        authorizationLevel: 'whenInUse',
        locationProvider: 'auto',
      })
      watchId = Geolocation.watchPosition(
        onPosition,
        e => {
          driveLog('location error', e)
          setGps(g => ({ ...g, error: `${e.code} ${e.message}` }))
        },
        {
          enableHighAccuracy: true,
          // 거리 필터는 위에서 직접 하므로 움직임과 관계없이 계속 받는다 (속도/정지 판단용).
          // 0이면 iOS는 거리 필터 없음(kCLDistanceFilterNone)으로 약 1초마다 보낸다.
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 1000,
        },
      )
      driveLog('watchPosition started', { watchId })
      // 위치정보 수집 사실 기록 (확인자료, 서버가 6개월 보관)
      locationLogService.logCollect('collect_start')
      // 주행 기록 상태 알림을 위해 알림 권한은 여기서(처음 주행할 때) 요청한다.
      // 거부해도 기록은 계속된다
      await permissionService.ensureNotificationPermission()
      if (cancelled) return
      // 잠금화면 표시(iOS Live Activity / Android 상시 알림) 시작.
      // Android는 포그라운드 서비스가 있어야 백그라운드에서도 위치가 계속 온다
      driveSessionService.start({
        cardTitle: cardRef.current.title,
        accent: cardRef.current.accent,
        startAt,
      })
    })()

    return () => {
      driveLog('tracking cleanup', { watchId })
      cancelled = true
      if (watchId !== null) {
        Geolocation.clearWatch(watchId)
        locationLogService.logCollect('collect_end')
      }
      driveSessionService.stop()
    }
  }, [phase, navigation, startAt, cardRef])

  return {
    points,
    distance,
    currentSpeed,
    maxSpeed,
    gps,
    current,
    lastFixAt,
  }
}
