import { useCallback, useState } from 'react'
import { Alert, AppState } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { HomeStackNavigationProp } from '@/navigation/types'

export const useHomeViewModel = () => {
  const { user, syncCardList } = useUserContext()
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<HomeStackNavigationProp>()

  // 앱 화면 전환시(다른 스크린에서 Home스크린으로 가는 경우 카드 상태 갱신 및 로그인 상태 체크)
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return
      ;(async () => {
        setLoading(true)
        const syncRes = await syncCardList()
        if (!syncRes.status) {
          Alert.alert(syncRes.message)
          return navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
        setLoading(false)
      })()
    }, [syncCardList, user?.id, navigation]),
  )

  // 전화번호가 없으면 백그라운드 스캔이 켜지지 않으므로 안내한다
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return
      if (user.phone.trim() === '')
        Alert.alert(
          '전화번호 등록 필요',
          '백그라운드 장치 스캔을 위해서는 전화번호 등록이 필요합니다.',
        )
    }, [user]),
  )

  // active 포그라운드로 돌아오는 경우 카드 상태 갱신
  useFocusEffect(
    useCallback(() => {
      const subScription = AppState.addEventListener('change', async state => {
        if (state === 'active') {
          console.log('active')
          setLoading(true)
          const res = await syncCardList()
          if (!res.status) {
            Alert.alert(res.message)
            return navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          }
          setLoading(false)
        }
      })

      return () => {
        subScription.remove()
      }
    }, [syncCardList, navigation]),
  )

  return { state: { loading } }
}
