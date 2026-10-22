import { callFunction } from './functions-client'
import { LocationLogService } from './types'

// 위치정보 수집·이용·제공사실 확인자료 (기록·보관·삭제는 서버가 한다)
export const locationLogService: LocationLogService = {
  // 주행 모드 위치 수집 시작/종료. 기록이 실패해도 주행은 막지 않는다
  logCollect: type => {
    callFunction('logLocationAccess', { type }).then(res => {
      if (!res.status) console.log('[LocationLog] failed', type, res.message)
    })
  },
  // 위치정보 동의 철회 시 확인자료 즉시 파기
  deleteMine: () =>
    callFunction(
      'deleteLocationData',
      undefined,
      '위치정보 삭제에 실패했습니다.',
    ),
}
