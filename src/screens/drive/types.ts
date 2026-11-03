import { RefObject } from 'react'
import { DocType, ViewModel } from '@/types/common'

export interface GeoPoint {
  latitude: number
  longitude: number
  timestamp: number
  speed: number | null // m/s
}

// consent: 위치 동의 전 (동의해야 기록을 시작한다)
export type DrivePhase = 'consent' | 'driving' | 'summary'

export interface DriveMapHandle {
  recenter: () => void
  // 요약 지도를 JPEG(base64)로 캡처. 지도를 못 불러왔으면 null
  captureSummary: () => Promise<string | null>
}

interface DriveState {
  phase: DrivePhase
  cardTitle: string
  driverName: string
  accent: string
  points: GeoPoint[]
  current: GeoPoint | null
  hasLocation: boolean
  weakSignal: boolean
  now: number
  startAt: number
  endAt: number | null
  elapsed: number // ms
  distance: number // m
  currentSpeed: number | null // m/s
  averageSpeed: number // m/s
  maxSpeed: number // m/s
  // 개발 빌드에서 GPS 품질 확인용
  gps: {
    accuracy: number
    rawSpeed: number
    received: number
    dropped: number
    error: string
  }
  mapRef: RefObject<DriveMapHandle | null>
  agreeing: boolean
  // 운행 기록 이메일
  emailSheetVisible: boolean
  sendingReport: boolean
  lastReportEmail: string
  // 보내기 창을 미리 채울 주소: 카드 이메일 → 내 이메일 → 이 기기에서 최근 보낸 주소
  reportEmail: string
  reportEmailSource: ReportEmailSource
}

interface DriveActions {
  agreeLocationPress: () => Promise<void>
  showDocPress: (type: DocType) => void
  endPress: () => void
  recenterPress: () => void
  emailPress: () => void
  closeEmailSheet: () => void
  sendReport: (email: string) => Promise<void>
  // 저장된 수신 이메일 주소 삭제
  clearSavedEmail: () => void
  donePress: () => void
}

export type DriveViewModel = ViewModel<DriveState, DriveActions>

export interface DriveMapProps {
  ref: RefObject<DriveMapHandle | null>
  phase: DrivePhase
  points: GeoPoint[]
  current: GeoPoint | null
  accent: string
}

export type ReportEmailSource = 'card' | 'user' | 'recent'

export interface DriveStatProps {
  label: string
  value: string
  unit?: string
}

export interface DriveEmailSheetProps {
  visible: boolean
  // 미리 채울 주소 (없으면 빈 문자열)
  initialEmail: string
  // 어디서 가져온 주소인지 (최근 보낸 주소일 때만 [저장된 주소 삭제]를 보여준다)
  source: ReportEmailSource
  sending: boolean
  onClose: () => void
  onSend: (email: string) => void
  onClearSaved: () => void
}
