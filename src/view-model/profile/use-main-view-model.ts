import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useUserContext } from '@/contexts'
import { ProfileStackNavigationProp } from '@/navigation/types'
import { authService, userService } from '@/services'
import { extractNumber } from '@/utils'
import { ProfileMainViewModel } from '@profile/types'

export const useMainViewModel = (): ProfileMainViewModel => {
  const { user, cards, actions: userContextActions } = useUserContext()
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<ProfileStackNavigationProp>()

  useEffect(() => {
    if (!user) return
    setPhone(user.phone)
    setNickname(user.nickname)
  }, [user])

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val))
    },

    nicknameInput: (val: string) => setNickname(val),

    savePress: async () => {
      if (!user) return
      if (nickname.trim() === '') return Alert.alert('닉네임을 입력해주세요.')

      if (phone.trim() === '') return Alert.alert('휴대폰 번호를 입력해주세요.')

      setLoading(true)
      const res = userService.updateNicknameAndPhone(
        user.id,
        nickname.trim(),
        phone,
      )
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        return setLoading(false)
      }

      userContextActions.setUserNicknameAndPhone(nickname, phone)
      navigation.goBack()
    },

    logoutPress: async () => {
      Alert.alert('Logout', '로그아웃 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            setLoading(true)
            try {
              await authService.signOut()
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
    deletePress: async () => {
      if (!user) return
      Alert.alert('Delete User', '회원탈퇴 하시겠습니까?', [
        {
          text: '예',
          onPress: async () => {
            try {
              setLoading(true)
              const res = await userService.deleteUser(user.id, cards)

              if (!res.status) {
                Alert.alert(res.message)
                return setLoading(false)
              }
              await authService.firebaseDeleteUser()
              await authService.signOut()
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
      loading,
      nickname,
      phone,
    },
    actions: actions,
  }
}
