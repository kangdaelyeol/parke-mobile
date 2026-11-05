import { useNavigation } from '@react-navigation/native'
import { ChangelogStackNavigationProp } from '@/navigation/types'
import { APP_STAGE, APP_VERSION, CHANGELOG } from '@/domain/app'
import { ChangelogViewModel } from '../types'

// 버전별 변경 내역 (설정 → 현재 버전)
export const useChangelogViewModel = (): ChangelogViewModel => {
  const navigation = useNavigation<ChangelogStackNavigationProp>()
  return {
    state: {
      entries: CHANGELOG,
      current: CHANGELOG[0],
      version: APP_VERSION,
      stage: APP_STAGE,
    },
    actions: { backPress: () => navigation.goBack() },
  }
}
