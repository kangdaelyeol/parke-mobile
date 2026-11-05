import { RefObject } from 'react'
import { DriveRecordDto, RecordRange } from '@/domain/drive'
import { DriveMapHandle, GeoPoint } from '@/screens/drive/types'
import { ViewModel } from '@/types/common'

interface DriveRecordsState {
  cardTitle: string
  accent: string
  // 이 카드의 모든 기록 (최근순)
  records: DriveRecordDto[]
  // 고른 기간
  range: RecordRange
  // 고른 기간 안의 기록과 거리 합계(m)
  visibleRecords: DriveRecordDto[]
  totalDistance: number
  loading: boolean
}

interface DriveRecordsActions {
  backPress: () => void
  recordPress: (record: DriveRecordDto) => void
  rangeChange: (range: RecordRange) => void
}

export type DriveRecordsViewModel = ViewModel<
  DriveRecordsState,
  DriveRecordsActions
>

interface DriveRecordState {
  record: DriveRecordDto
  accent: string
  points: GeoPoint[]
  loading: boolean
  deleting: boolean
  mapRef: RefObject<DriveMapHandle | null>
}

interface DriveRecordActions {
  backPress: () => void
  deletePress: () => void
}

export type DriveRecordViewModel = ViewModel<
  DriveRecordState,
  DriveRecordActions
>

export interface DriveRecordHeaderProps {
  title: string
  onBack: () => void
}

export interface DriveRecordItemProps {
  record: DriveRecordDto
  accent: string
  onPress: () => void
}
