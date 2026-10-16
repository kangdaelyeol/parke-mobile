import { RefObject } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
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
  docType: DocType
  termModalRef: RefObject<BottomSheetModal | null>
}

interface DriveActions {
  agreeLocationPress: () => Promise<void>
  showDocPress: (type: DocType) => void
  endPress: () => void
  recenterPress: () => void
  emailPress: () => void
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

export interface DriveStatProps {
  label: string
  value: string
  unit?: string
}
