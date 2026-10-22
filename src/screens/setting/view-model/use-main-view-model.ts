import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import {
  bleService,
  cacheService,
  driveSessionService,
  legalService,
  locationLogService,
  settingService,
} from '@/services'
import { LOCATION_CONSENT_DOCS } from '@/constants'
import { DocType } from '@/types/common'
import { SettingMainViewModel } from '@setting/types'
import { useUserContext } from '@/contexts'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SettingStackNavigationProp } from '@/navigation/types'

export const useMainViewModel = (): SettingMainViewModel => {
  const { user, validateUser, actions: userContextActions } = useUserContext()
  const [updatingConsent, setUpdatingConsent] = useState(false)
  const locationAgreed = legalService.hasLocationConsent(user?.consents)
  const [autoSet, setAutoSet] = useState(false)
  const [notice, setNotice] = useState(false)
  const [active, setActive] = useState(true)

  const navigation = useNavigation<SettingStackNavigationProp>()

  // init settings value on UI
  useEffect(() => {
    const settings = settingService.getSettings()
    setAutoSet(settings.autoSet)
    setNotice(settings.notice)
    setActive(settings.active)
  }, [])

  // Validate user
  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        const res = await validateUser()
        if (!res.status) {
          Alert.alert(res.message)
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
        }
      })()
    }, [validateUser, navigation]),
  )

  const noticeDisabled = active === false || autoSet === false ? true : false

  const autoSetDisabled = active === false ? true : false

  const state = {
    locationAgreed,
    updatingConsent,
    noticeDisabled,
    autoSetDisabled,
    notice,
    autoSet,
    active,
  }

  const actions = {
    autoSetChange: (val: boolean) => {
      if (val === false) {
        setNotice(true)
        settingService.setNotice(true)
      }

      settingService.setAutoSet(val)
      setAutoSet(val)
    },

    activeChange: (val: boolean) => {
      setActive(val)
      settingService.setActive(val)
      bleService.refreshBackgroundScan()
    },

    noticeChange: (val: boolean) => {
      setNotice(val)
      settingService.setNotice(val)
    },

    docPress: (docType: DocType) => {
      navigation.navigate('LegalDoc', { docType })
    },
    // 위치기반서비스 약관 + 개인위치정보 동의 (선택 동의라 설정에서 언제든 바꿀 수 있다)
    agreeLocationPress: () => {
      if (!user || locationAgreed || updatingConsent) return
      Alert.alert(
        '위치정보 이용 동의',
        '위치기반서비스 이용약관과 개인위치정보 수집·이용에 동의하면 주행 모드(운행일지)를 사용할 수 있습니다. 주행 중에는 화면이 꺼져 있어도 주행을 끝낼 때까지 위치정보를 수집합니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '약관 보기',
            onPress: () =>
              navigation.navigate('LegalDoc', { docType: 'location-consent' }),
          },
          {
            text: '동의',
            onPress: async () => {
              setUpdatingConsent(true)
              const res = await legalService.recordConsents(
                user.id,
                LOCATION_CONSENT_DOCS,
                true,
              )
              setUpdatingConsent(false)
              if (!res.status) return Alert.alert(res.message)
              userContextActions.setConsents(res.payload)
              Alert.alert(
                '동의되었습니다',
                '이제 주행 모드를 사용할 수 있습니다.',
              )
            },
          },
        ],
      )
    },
    withdrawLocationPress: () => {
      if (!user || !locationAgreed || updatingConsent) return
      Alert.alert(
        '위치정보 동의 철회',
        '철회하면 주행 모드(운행일지)를 사용할 수 없고, 진행 중인 주행은 바로 종료됩니다. 다시 사용하려면 주행 모드를 켤 때 동의하면 됩니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '철회',
            style: 'destructive',
            onPress: async () => {
              setUpdatingConsent(true)
              // 진행 중인 주행이 있으면 즉시 종료 (위치 수집 중단)
              driveSessionService.requestEnd()
              const res = await legalService.recordConsents(
                user.id,
                LOCATION_CONSENT_DOCS,
                false,
              )
              if (!res.status) {
                setUpdatingConsent(false)
                return Alert.alert(res.message)
              }
              userContextActions.setConsents(res.payload)
              // 철회 시 위치정보 수집·이용·제공사실 확인자료를 즉시 파기 (운행 기록은 서버에 저장하지 않음)
              const deleteRes = await locationLogService.deleteMine()
              setUpdatingConsent(false)
              if (!deleteRes.status) {
                return Alert.alert(
                  '철회되었습니다',
                  `동의는 철회되었지만 위치정보 기록을 삭제하지 못했습니다. 잠시 후 다시 철회해주세요.\n(${deleteRes.message})`,
                )
              }
              Alert.alert(
                '철회되었습니다',
                '위치정보 수집·이용 동의를 철회했습니다.',
              )
            },
          },
        ],
      )
    },
    onBoardingPress: () => {
      cacheService.setHasSeenOnBoarding(false)
      navigation.reset({ index: 0, routes: [{ name: 'OnBoarding' }] })
    },
  }

  return {
    state,
    actions,
  }
}
