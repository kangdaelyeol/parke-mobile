import { cacheClient } from '@/client'
import { callFunction } from './functions-client'
import { DriveReportService } from './types'

// 운행 기록 이메일 발송 (backend/functions의 sendDriveReport).
// 메일 내용(HTML)은 서버가 만들고, 앱은 측정값과 지도 이미지만 보낸다.
// 발송 사실(받는 사람·일시·목적)은 서버가 위치정보 확인자료로 기록한다.
export const driveReportService: DriveReportService = {
  send: async input => {
    const res = await callFunction<unknown>(
      'sendDriveReport',
      input,
      '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
    )
    if (!res.status) return res
    cacheClient.setLastReportEmail(input.email)
    return { status: true, payload: true }
  },
  getLastEmail: () => cacheClient.getLastReportEmail(),
  clearLastEmail: () => cacheClient.setLastReportEmail(''),
}
