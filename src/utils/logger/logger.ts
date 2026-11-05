// 앱 로그. 개발 빌드에서만 콘솔에 남기고 릴리스 빌드에서는 아무것도 하지 않는다
// (console.log는 릴리스 빌드에서도 기기 로그(Xcode 콘솔·logcat)에 그대로 남는다).
// 전화번호·로그인 응답 같은 사용자 정보는 개발 빌드에서도 넘기지 않는다
export const logger = {
  // 흐름 확인용
  log: (...args: unknown[]) => {
    if (__DEV__) console.log(...args)
  },
  // 실패 기록. 개발 중 빨간 오류 창이 뜨지 않게 console.error가 아닌 console.log로 남긴다.
  // 오류 수집 서비스를 붙이면 릴리스 빌드에서는 여기서 보낸다
  error: (...args: unknown[]) => {
    if (__DEV__) console.log(...args)
  },
}
