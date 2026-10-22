import { useNavigation } from '@react-navigation/native'
import { PermissionStackNavigationProp } from '@/navigation/types'
import { PermissionFooterViewModel } from '@/screens/permission/types'

// 권한 안내만 하고, 실제 요청은 각 기능을 처음 쓸 때 한다
//  - 블루투스: 기기 등록 검색 / 백그라운드 자동 감지 시작
//  - 카메라: 제품 QR 스캔
//  - 알림: 백그라운드 자동 감지 시작(번호 변경 알림), 주행 시작(주행 기록 상태)
//  - 위치: 주행 모드 시작
export const usePermissionFooterViewModel = (): PermissionFooterViewModel => {
  const navigation = useNavigation<PermissionStackNavigationProp>()

  const onConfirmPress = () => {
    navigation.replace('Login')
  }

  return {
    state: {},
    actions: { onConfirmPress },
  }
}
