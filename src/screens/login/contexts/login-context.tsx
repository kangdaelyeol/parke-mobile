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
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LoginStackNavigationProp } from '@/navigation/types'
import { LoginContextValue } from '@login/types'
import { userService, authService } from '@/services'
import { useUserContext } from '@/contexts'
import { useTermBottomSheet } from '@/hooks'
import { DocType } from '@/types/common'
import { UserDto } from '@/domain/user'

const LoginContext = createContext({} as LoginContextValue)

export const LoginContextProvider = ({ children }: PropsWithChildren) => {
  const { actions: userContectActions } = useUserContext()
  const navigation = useNavigation<LoginStackNavigationProp>()
  const [loading, setLoading] = useState(false)
  const [ageConfirm, setAgeConfirm] = useState(false)
  const [termConfirm, setTermConfirm] = useState(false)
  const [consentConfirm, setConsentConfirm] = useState(false)
  const [thirdConsentConfirm, setThirdConsentConfirm] = useState(false)
  // 선택 동의: 위치기반서비스 이용약관 / 개인위치정보 수집·이용 (주행 모드용)
  const [locationTermsConfirm, setLocationTermsConfirm] = useState(false)
  const [locationConsentConfirm, setLocationConsentConfirm] = useState(false)
  // 로그인은 필수 항목만 동의하면 된다
  const requiredConfirm =
    ageConfirm && termConfirm && consentConfirm && thirdConsentConfirm
  const locationConfirm = locationTermsConfirm && locationConsentConfirm
  const allConfirm = requiredConfirm && locationConfirm

  const { modalRef, docType, showBottomSheet } = useTermBottomSheet()

  const confirmSheetRef = useRef<BottomSheetModal | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!navigation) return
      setLoading(true)

      const uid = await authService.autoLogin()
      if (!uid) return setLoading(false)

      const userRes = await userService.getUser(uid)
      if (!userRes.status) {
        Alert.alert(userRes.message)
        return setLoading(false)
      }

      userContectActions.initUser(userRes.payload)
      navigation.replace('Home')
    })()
  }, [navigation, userContectActions])

  const setAllConfirm = (val: boolean) => {
    setAgeConfirm(val)
    setTermConfirm(val)
    setConsentConfirm(val)
    setThirdConsentConfirm(val)
    setLocationTermsConfirm(val)
    setLocationConsentConfirm(val)
  }

  const allConfirmPress = () => {
    const val = !allConfirm
    setAllConfirm(val)
    val && confirmSheetRef.current?.close()
  }

  // [동의하고 계속하기]: 필수 항목이 비어 있으면 전체 동의, 아니면 고른 그대로 닫는다
  const agreeAndContinuePress = () => {
    if (!requiredConfirm) setAllConfirm(true)
    confirmSheetRef.current?.close()
  }

  const locationTermsConfirmPress = () => setLocationTermsConfirm(prev => !prev)

  const locationConsentConfirmPress = () =>
    setLocationConsentConfirm(prev => !prev)

  const ageConfirmPress = () => setAgeConfirm(prev => !prev)

  const termConfirmPress = () => setTermConfirm(prev => !prev)

  const consentConfirmPress = () => setConsentConfirm(prev => !prev)

  const thirdConsentConfirmPress = () => setThirdConsentConfirm(prev => !prev)

  const termsAndConsentConfirmPress = () => {
    confirmSheetRef.current?.present()
  }

  // 위치 선택 동의를 했으면 동의 시각을 남긴다 (실패해도 로그인은 진행, 주행 시작 때 다시 묻는다)
  const withLocationConsent = async (dto: UserDto): Promise<UserDto> => {
    if (!locationConfirm || dto.locationConsentAgreedAt) return dto
    const res = await userService.agreeLocation(dto.id)
    return res.status ? { ...dto, locationConsentAgreedAt: Date.now() } : dto
  }

  // firebase 로그인 이후 공통 흐름: 유저 조회(없으면 생성) -> 화면 이동
  const enterWithFirebaseId = async (firebaseId: string, nickname: string) => {
    const getUserRes = await userService.getUser(firebaseId)

    if (getUserRes.status) {
      userContectActions.initUser(await withLocationConsent(getUserRes.payload))
      return navigation.replace('Home')
    }

    const createUserRes = await userService.createUser({
      id: firebaseId,
      nickname,
    })

    if (!createUserRes.status) {
      Alert.alert(createUserRes.message)
      return setLoading(false)
    }
    userContectActions.initUser(
      await withLocationConsent(createUserRes.payload),
    )
    return navigation.replace('Init')
  }

  // 카카오/애플: 식별자로 firebase 이메일 계정 로그인 후 공통 흐름
  const loginWithIdentifier = async (
    identifier: string,
    nickname: string,
    providerLogout: () => void,
  ) => {
    const firebaseId = await authService.signInOrLogin(identifier)

    if (!firebaseId) {
      Alert.alert('로그인에 실패하였습니다')
      providerLogout()
      return setLoading(false)
    }

    return enterWithFirebaseId(firebaseId, nickname)
  }

  const kakaoLoginPress = async () => {
    if (!requiredConfirm) return
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

    return loginWithIdentifier(email, nickname, authService.kakaoLogout)
  }

  const showDocPress = (type: DocType) => {
    showBottomSheet(type)
  }

  const appleLoginPress = async () => {
    if (!requiredConfirm) return
    if (loading) return
    setLoading(true)

    const appleUserId = await authService.appleLogin()

    if (!appleUserId) {
      Alert.alert('로그인에 실패하였습니다')
      return setLoading(false)
    }

    return loginWithIdentifier(appleUserId, '', authService.appleLogout)
  }

  const googleLoginPress = async () => {
    if (!requiredConfirm) return
    if (loading) return
    setLoading(true)

    const googleUser = await authService.googleLogin()

    if (!googleUser) {
      Alert.alert('로그인에 실패하였습니다')
      return setLoading(false)
    }

    return enterWithFirebaseId(googleUser.uid, googleUser.nickname)
  }

  return (
    <LoginContext.Provider
      value={{
        state: {
          loading,
          allConfirm,
          requiredConfirm,
          ageConfirm,
          termConfirm,
          consentConfirm,
          thirdConsentConfirm,
          locationTermsConfirm,
          locationConsentConfirm,
          modalRef,
          docType,
          confirmSheetRef,
        },
        actions: {
          kakaoLoginPress,
          allConfirmPress,
          agreeAndContinuePress,
          ageConfirmPress,
          termConfirmPress,
          consentConfirmPress,
          thirdConsentConfirmPress,
          locationTermsConfirmPress,
          locationConsentConfirmPress,
          showDocPress,
          appleLoginPress,
          googleLoginPress,
          termsAndConsentConfirmPress,
        },
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginContext = () => useContext(LoginContext)
