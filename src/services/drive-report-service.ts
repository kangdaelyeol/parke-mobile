import { getApp } from '@react-native-firebase/app'
import { getFunctions, httpsCallable } from '@react-native-firebase/functions'
import { cacheClient } from '@/client'
import { FUNCTIONS_REGION } from '@/constants'
import { serviceFail, serviceOk } from '@/utils'
import { DriveReportService } from './types'

// 운행 기록 이메일 발송 (backend/functions의 sendDriveReport).
// 메일 내용(HTML)은 서버가 만들고, 앱은 측정값과 지도 이미지만 보낸다.
export const driveReportService: DriveReportService = {
  send: async input => {
    try {
      const call = httpsCallable(
        getFunctions(getApp(), FUNCTIONS_REGION),
        'sendDriveReport',
      )
      await call(input)
      cacheClient.setLastReportEmail(input.email)
      return serviceOk(true)
    } catch (e) {
      console.log('[DriveReport] send failed', e)
      // 서버가 보낸 안내 문구(HttpsError message)가 있으면 그대로 보여준다
      const message =
        e instanceof Error && e.message
          ? e.message.replace(/^\[[^\]]+\]\s*/, '')
          : ''
      return serviceFail(
        message || '메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  },
  getLastEmail: () => cacheClient.getLastReportEmail(),
}
