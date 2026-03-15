import { createContext, PropsWithChildren, useContext } from 'react'
import { useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { convertPhone } from '@/helpers'
import { InitStackNavigationProp } from '@/navigation/types'
import { userService } from '@/services'
import { extractNumber } from '@/utils'
import { InitViewModel } from '@/screens/init/types'

const InitContext = createContext({} as InitViewModel)

export const InitContextProvider = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation<InitStackNavigationProp>()
  const { user, setUser } = useUserContext()
  const [nickname, setNickname] = useState(user.nickname)
  const [phone, setPhone] = useState(user.phone)
  const [loading, setLoading] = useState(false)

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val))
    },
    nicknameInput: (val: string) => setNickname(val),

    savePress: async () => {
      console.log(nickname, phone)
      if (nickname.trim() === '') return Alert.alert('닉네임을 입력해주세요.')

      if (phone.trim() === '') return Alert.alert('휴대폰 번호를 입력해주세요.')

      setLoading(true)
      const res = await userService.updateNicknameAndPhone(
        user.id,
        nickname.trim(),
        phone,
      )
      setUser(prev => ({ ...prev, nickname, phone }))
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }
      navigation.replace('Home')
    },
    skipPress: () => {
      navigation.replace('Home')
    },
  }

  return (
    <InitContext.Provider
      value={{
        actions,
        state: {
          nickname,
          phone: convertPhone(phone),
          loading,
        },
      }}
    >
      {children}
    </InitContext.Provider>
  )
}

export const useInitContext = () => useContext(InitContext)
