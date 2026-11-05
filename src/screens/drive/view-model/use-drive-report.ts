import { RefObject, useState } from 'react'
import { Alert } from 'react-native'
import { GeoPoint } from '@/domain/drive'
import { UserDto } from '@/domain/user'
import { driveReportService } from '@/services'
import { CardState } from '@/services/types'
import { DriveMapHandle, ReportEmailSource } from '@/screens/drive/types'
import { formatDateTime, toKmh } from '@/utils'

interface DriveReportOptions {
  card: CardState | undefined
  user: UserDto | null
  // 요약 지도를 이미지로 담는다
  mapRef: RefObject<DriveMapHandle | null>
  // 보고서에 담을 주행 요약
  summary: {
    startAt: number
    endAt: number
    distance: number // m
    averageSpeed: number // m/s
    maxSpeed: number // m/s
    points: GeoPoint[]
  }
}

// 운행 기록을 이메일 보고서로 보내기 (주행 요약 화면의 [이메일로 보내기])
export const useDriveReport = ({
  card,
  user,
  mapRef,
  summary,
}: DriveReportOptions) => {
  const [emailSheetVisible, setEmailSheetVisible] = useState(false)
  const [sendingReport, setSendingReport] = useState(false)
  const [lastReportEmail, setLastReportEmail] = useState(() =>
    driveReportService.getLastEmail(),
  )
  // 보내기 창을 미리 채울 주소: 카드 이메일 → 내 이메일 → 이 기기에서 최근 보낸 주소
  const reportEmailSource: ReportEmailSource = card?.email
    ? 'card'
    : user?.email
    ? 'user'
    : 'recent'

  return {
    state: {
      emailSheetVisible,
      sendingReport,
      lastReportEmail,
      reportEmail: card?.email || user?.email || lastReportEmail,
      reportEmailSource,
    },
    actions: {
      clearSavedEmail: () => {
        driveReportService.clearLastEmail()
        setLastReportEmail('')
      },
      emailPress: () => setEmailSheetVisible(true),
      closeEmailSheet: () => {
        if (!sendingReport) setEmailSheetVisible(false)
      },
      sendReport: async (email: string) => {
        if (sendingReport) return
        setSendingReport(true)

        // 요약 지도(카카오맵)를 이미지로 담아 보낸다. 실패하면 지도 없이 보낸다
        const mapImage = (await mapRef.current?.captureSummary()) ?? null
        const { points } = summary
        const first = points[0]
        const last = points[points.length - 1]
        const res = await driveReportService.send({
          email,
          cardTitle: card?.title ?? 'Parke',
          driverName: user?.nickname || '운전자',
          startAt: summary.startAt,
          endAt: summary.endAt,
          distanceMeters: summary.distance,
          averageSpeedKmh: toKmh(summary.averageSpeed),
          maxSpeedKmh: toKmh(summary.maxSpeed),
          startPoint: first
            ? { lat: first.latitude, lng: first.longitude }
            : null,
          endPoint: last ? { lat: last.latitude, lng: last.longitude } : null,
          mapImage,
        })

        setSendingReport(false)
        if (!res.status) {
          Alert.alert('보내지 못했어요', res.message)
          return
        }
        setEmailSheetVisible(false)
        setLastReportEmail(email)
        // 위치정보법 제19조: 이용자가 지정한 제3자에게 개인위치정보를 제공할 때마다 즉시 통보
        Alert.alert(
          '운행 기록을 보냈어요',
          [
            `제공받는 자: ${email}`,
            `제공 일시: ${formatDateTime(Date.now())}`,
            '제공 목적: 운행 기록 보고서 전달',
          ].join('\n'),
        )
      },
    },
  }
}
