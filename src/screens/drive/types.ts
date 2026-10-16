import { RefObject } from 'react'
import { ViewModel } from '@/types/common'

export interface GeoPoint {
  latitude: number
  longitude: number
  timestamp: number
  speed: number | null // m/s
}

export type DrivePhase = 'driving' | 'summary'

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
}

interface DriveActions {
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
