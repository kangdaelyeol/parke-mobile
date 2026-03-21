import {
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import appleAuth from '@invertase/react-native-apple-authentication'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { UserDto } from '@/domain/user'
import { LoginStackNavigationProp } from '@/navigation/types'
import { LoginContextValue } from '@login/types'
import { userService, authService } from '@/services'
import { getHashedPassword } from '@/helpers'
import { useUserContext } from '@/contexts'
import { useTermBottomSheet } from '@/hooks'
import { DocType } from '@/types/common'

const LoginContext = createContext({} as LoginContextValue)

const isUserDto = (dto: any): dto is UserDto => dto.id

export const LoginContextProvider = ({ children }: PropsWithChildren) => {
  const { setUser } = useUserContext()
  const navigation = useNavigation<LoginStackNavigationProp>()
  const [loading, setLoading] = useState(false)
  const [allConfirm, setAllConfirm] = useState(false)
  const [ageConfirm, setAgeConfirm] = useState(false)
  const [termConfirm, setTermConfirm] = useState(false)
  const [consentConfirm, setConsentConfirm] = useState(false)
  const [thirdConsentConfirm, setThirdConsentConfirm] = useState(false)

  const { modalRef, docType, showBottomSheet } = useTermBottomSheet()

  const confirmSheetRef = useRef<BottomSheetModal | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!navigation) return
      setLoading(true)
      const kakaoProfile = await authService.getKakaoProfile()
      if (!kakaoProfile) return setLoading(false)

      const password = getHashedPassword(kakaoProfile.email)
      const uid = await authService.firebaseLogin(kakaoProfile.email, password)
      if (!uid) return setLoading(false)

      const user = await userService.get(uid)
      if (!user) return setLoading(false)

      setUser(user)
      navigation.replace('Home')
    })()
  }, [navigation, setUser])

  const allConfirmPress = () => {
    const val = !allConfirm
    setAllConfirm(val)
    setAgeConfirm(val)
    setTermConfirm(val)
    setConsentConfirm(val)
    setThirdConsentConfirm(val)
    val && confirmSheetRef.current?.close()
  }

  const ageConfirmPress = () => {
    const val = !ageConfirm
    if (val && termConfirm && consentConfirm && thirdConsentConfirm) {
      setAllConfirm(true)
    } else setAllConfirm(false)

    setAgeConfirm(val)
    console.log(val)
  }

  const termConfirmPress = () => {
    const val = !termConfirm
    if (val && ageConfirm && consentConfirm && thirdConsentConfirm) {
      setAllConfirm(true)
    } else setAllConfirm(false)

    setTermConfirm(val)
  }

  const consentConfirmPress = () => {
    const val = !consentConfirm
    if (val && ageConfirm && termConfirm && thirdConsentConfirm) {
      setAllConfirm(true)
    } else setAllConfirm(false)

    setConsentConfirm(val)
  }

  const thirdConsentConfirmPress = () => {
    const val = !thirdConsentConfirm
    if (val && ageConfirm && consentConfirm && termConfirm) {
      setAllConfirm(true)
    } else setAllConfirm(false)

    setThirdConsentConfirm(val)
  }

  const termsAndConsentConfirmPress = () => {
    console.log(confirmSheetRef.current)
    confirmSheetRef.current?.present()
  }

  const kakaoLoginPress = async () => {
    if (!allConfirm) return
    if (loading) return

    setLoading(true)
    const kakaoProfile = await authService.kakaoLogin()

    if (!kakaoProfile) {
      Alert.alert(
        '카카오 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
      return setLoading(false)
    }

    const { email, nickname } = kakaoProfile

    // 첫 로그인시 - 가입
    const password = getHashedPassword(email)
    const uid = await authService.firebaseSignIn(email, password)

    if (!uid) {
      // 계정이 존재하는 경우
      const firebaseUid = await authService.firebaseLogin(email, password)

      if (!firebaseUid) {
        Alert.alert('로그인에 실패하였습니다. 다시 시도해주세요.')
        setLoading(false)
        return
      }

      const userRes = await userService.get(firebaseUid)

      if (!isUserDto(userRes)) {
        Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.')
        return setLoading(false)
      }

      setUser(userRes)
      return navigation.replace('Home')
    }

    const userRes = await userService.create({ id: uid, nickname })

    if (!isUserDto(userRes)) {
      Alert.alert('네트워크 오류: 잠시 후 다시 시도해주세요.')
      return setLoading(false)
    }

    setUser(userRes)
    return navigation.replace('Init')
  }

  const showDocPress = (type: DocType) => {
    showBottomSheet(type)
  }

  const appleLoginPress = async () => {
    if (!appleAuth.isSupported)
      return Alert.alert('이 기기에서 지원하지 않습니다.')
    if (!allConfirm) return
    if (loading) return
    setLoading(true)

    try {
      const credential = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      if (!credential) return setLoading(false)
      console.log(credential)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }

    setLoading(false)
  }

  return (
    <LoginContext.Provider
      value={{
        state: {
          loading,
          allConfirm,
          ageConfirm,
          termConfirm,
          consentConfirm,
          thirdConsentConfirm,
          modalRef,
          docType,
          confirmSheetRef,
        },
        actions: {
          kakaoLoginPress,
          allConfirmPress,
          ageConfirmPress,
          termConfirmPress,
          consentConfirmPress,
          thirdConsentConfirmPress,
          showDocPress,
          appleLoginPress,
          termsAndConsentConfirmPress,
        },
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginContext = () => useContext(LoginContext)
