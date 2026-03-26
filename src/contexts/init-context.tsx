import {
  useState,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useUserContext } from '@/contexts'
import { InitStackNavigationProp } from '@/navigation/types'
import { userService } from '@/services'
import { extractNumber } from '@/utils'
import { InitViewModel } from '@/screens/init/types'

const InitContext = createContext({} as InitViewModel)

export const InitContextProvider = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation<InitStackNavigationProp>()
  const { user, actions: userContextActions } = useUserContext()
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const actions = {
    phoneInput: (val: string) => {
      setPhone(extractNumber(val))
    },
    nicknameInput: (val: string) => setNickname(val.trim()),

    savePress: async () => {
      if (!user) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        return navigation.replace('Login')
      }
      if (nickname.trim() === '') return Alert.alert('닉네임을 입력해주세요.')

      if (phone.trim() === '') return Alert.alert('휴대폰 번호를 입력해주세요.')

      setLoading(true)
      const res = await userService.updateNicknameAndPhone(
        user.id,
        nickname,
        phone,
      )
      userContextActions.setUserNicknameAndPhone(nickname, phone)
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }
      navigation.replace('Home')
    },
    skipPress: async () => {
      if (!user) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        navigation.replace('Login')
        return
      }
      setLoading(true)
      const res = await userService.updateNicknameAndPhone(
        user.id,
        nickname === '' ? 'user' : nickname,
        phone === '' ? '01000000000' : phone,
      )
      userContextActions.setUserNicknameAndPhone(nickname, '01000000000')
      if (!res) {
        Alert.alert('오류가 발생했습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }
      navigation.replace('Home')
    },
  }

  useEffect(() => {
    if (!user) return
    setNickname(user.nickname)
    setPhone(user.phone)
  }, [user])

  return (
    <InitContext.Provider
      value={{
        actions,
        state: {
          nickname,
          phone,
          loading,
        },
      }}
    >
      {children}
    </InitContext.Provider>
  )
}

export const useInitContext = () => useContext(InitContext)
