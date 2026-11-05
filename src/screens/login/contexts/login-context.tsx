import {
  useCallback,
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { Alert } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { LoginStackNavigationProp } from '@/navigation/types'
import { LoginContextValue } from '@login/types'
import { userService, authService, legalService } from '@/services'
import { useUserContext } from '@/contexts'
import { DocType } from '@/types/common'
import { UserDto } from '@/domain/user'
import { LOCATION_CONSENT_DOCS, REQUIRED_CONSENT_DOCS } from '@/constants'
import { logger } from '@/utils'

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

  const confirmSheetRef = useRef<BottomSheetModal | null>(null)
  // 문서를 보러 갔다가 돌아오면 동의 시트를 다시 연다
  const reopenSheetOnFocus = useRef(false)

  useFocusEffect(
    useCallback(() => {
      if (!reopenSheetOnFocus.current) return
      reopenSheetOnFocus.current = false
      confirmSheetRef.current?.present()
    }, []),
  )

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

  // 동의 항목별로 { agreed, agreedAt, effectiveDate }를 남긴다.
  // 만 14세 확인·필수 3종은 항상, 위치 2종은 선택 동의했을 때만 (실패해도 로그인은 진행, 위치는 주행 시작 때 다시 묻는다)
  const withConsents = async (dto: UserDto): Promise<UserDto> => {
    const required = ['age', ...REQUIRED_CONSENT_DOCS] as const
    const docs = locationConfirm
      ? [...required, ...LOCATION_CONSENT_DOCS]
      : [...required]
    const res = await legalService.recordConsents(dto.id, docs, true)
    if (!res.status) {
      logger.error('[Login] consent record failed', res.message)
      return dto
    }
    return { ...dto, consents: { ...dto.consents, ...res.payload } }
  }

  // firebase 로그인 이후 공통 흐름: 유저 조회(없으면 생성) -> 화면 이동
  const enterWithFirebaseId = async (firebaseId: string, nickname: string) => {
    const getUserRes = await userService.getUser(firebaseId)

    if (getUserRes.status) {
      userContectActions.initUser(await withConsents(getUserRes.payload))
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
    userContectActions.initUser(await withConsents(createUserRes.payload))
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

  // 동의 시트가 문서 화면을 덮지 않도록 잠시 닫고, 돌아오면 다시 연다
  const showDocPress = (type: DocType) => {
    reopenSheetOnFocus.current = true
    confirmSheetRef.current?.dismiss()
    navigation.navigate('LegalDoc', { docType: type })
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
