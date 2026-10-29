import { RefObject } from 'react'
import { DriveRecordDto } from '@/domain/drive'
import { DriveMapHandle, GeoPoint } from '@/screens/drive/types'
import { ViewModel } from '@/types/common'

interface DriveRecordsState {
  cardTitle: string
  accent: string
  records: DriveRecordDto[]
  loading: boolean
}

interface DriveRecordsActions {
  backPress: () => void
  recordPress: (record: DriveRecordDto) => void
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
