// 주행 기록 요약 (drive/{uid}/{cardId}/{driveId}). 목록은 경로 없이 가볍게 읽는다
export interface DriveRecordDto {
  id: string
  cardId: string
  cardTitle: string // 저장 당시 카드 이름
  startAt: number
  endAt: number
  distance: number // m
  averageSpeed: number // m/s
  maxSpeed: number // m/s
}

// 주행 경로 (drivePath/{uid}/{driveId}): [위도, 경도] 목록
export type DrivePathDto = [number, number][]
