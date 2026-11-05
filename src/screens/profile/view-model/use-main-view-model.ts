import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useUserContext } from '@/contexts'
import { ProfileStackNavigationProp } from '@/navigation/types'
import {
  authService,
  cacheService,
  driveReportService,
  userService,
} from '@/services'
import { extractNumber, isEmail } from '@/utils'
import { ProfileMainViewModel } from '@profile/types'
import { resetRoot } from '@/navigation/actions'

export const useMainViewModel = (): ProfileMainViewModel => {
  const {
    user,
    actions: userContextActions,
    validateUser,
    setCards,
  } = useUserContext()
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  // 이 기기에서 마지막으로 운행 기록을 보낸 주소
  const [reportEmail, setReportEmail] = useState(() =>
    driveReportService.getLastEmail(),
  )
  const [email, setEmail] = useState(user?.email ?? '')

  const navigation = useNavigation<ProfileStackNavigationProp>()

  useEffect(() => {
    if (!user) return
    setPhone(user.phone)
    setNickname(user.nickname)
    setEmail(user.email ?? '')
  }, [user])

  // validate user
  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const res = await validateUser()
        if (!res.status) {
          Alert.alert(res.message)
          navigation.dispatch(resetRoot('Login'))
        }
      })()
    }, [validateUser, navigation]),
  )

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val))
    },

    nicknameInput: (val: string) => setNickname(val),

    savePress: async () => {
      if (!user) return
      if (nickname.trim() === '') return Alert.alert('닉네임을 입력해주세요.')

      if (phone.trim() === '') return Alert.alert('휴대폰 번호를 입력해주세요.')

      const nextEmail = email.trim()
      if (nextEmail && !isEmail(nextEmail))
        return Alert.alert('이메일 주소를 확인해주세요.')

      setLoading(true)
      const res = await userService.updateNicknameAndPhone(
        user.id,
        nickname.trim(),
        phone,
      )
      if (!res.status) {
        Alert.alert(res.message)
        return setLoading(false)
      }

      userContextActions.setUserNicknameAndPhone(nickname, phone)

      if (nextEmail !== (user.email ?? '')) {
        const emailRes = await userService.updateEmail(user.id, nextEmail)
        if (!emailRes.status) {
          Alert.alert(emailRes.message)
          return setLoading(false)
        }
        userContextActions.setUserEmail(nextEmail)
      }
      // 저장하면 예전처럼 홈으로 돌아간다 (이제는 홈 탭)
      navigation.navigate('HomeTab')
    },

    logoutPress: async () => {
      Alert.alert('Logout', '로그아웃 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            setLoading(true)
            try {
              await authService.signOut()
              // 기기에 남은 사용자별 기록(BLE 감지, 오늘의 현황, 수신 이메일)을 지운다
              cacheService.clearUserData()
              setCards([])
              return navigation.navigate('Login')
            } catch (e) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
              return setLoading(false)
            }
          },
        },
        {
          text: '아니오',
          style: 'cancel',
        },
      ])
    },
    emailInput: (v: string) => setEmail(v),
    clearReportEmailPress: () => {
      Alert.alert('저장된 이메일 삭제', `${reportEmail}을(를) 삭제할까요?`, [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            driveReportService.clearLastEmail()
            setReportEmail('')
          },
        },
      ])
    },
    deletePress: async () => {
      if (!user) return
      Alert.alert('Delete User', '회원탈퇴 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            try {
              setLoading(true)
              // 카드·회원 정보·동의 기록·확인자료·로그인 계정은 서버가 지운다
              const res = await userService.deleteAccount()

              if (!res.status) {
                Alert.alert(res.message)
                return setLoading(false)
              }
              await authService.signOut()
              // 기기에 남은 개인정보도 지운다
              cacheService.clearUserData()
              setCards([])
              return navigation.replace('Login')
            } catch (e) {
              Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
              return navigation.replace('Login')
            }
          },
        },
        { text: '아니오', style: 'cancel' },
      ])
    },
  }

  return {
    state: {
      reportEmail,
      email,
      loading,
      nickname,
      phone,
    },
    actions: actions,
  }
}
