export interface UserDto {
  id: string
  nickname: string
  phone: string
  cardIdList: string[]
  // 위치기반서비스 약관·개인위치정보 수집 동의 시각 (선택 동의, 없으면 미동의)
  locationConsentAgreedAt?: number
}
