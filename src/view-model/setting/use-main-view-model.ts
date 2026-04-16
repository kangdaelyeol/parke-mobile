import { useEffect, useState } from 'react'
import { cacheService, settingService } from '@/services'
import { SettingMainViewModel } from '@setting/types'
import { useSettingContext } from '@/contexts'
import { useNavigation } from '@react-navigation/native'
import { SettingStackNavigationProp } from '@/navigation/types'

export const useMainViewModel = (): SettingMainViewModel => {
  const { showBottomSheet } = useSettingContext()
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

  const noticeDisabled = active === false || autoSet === false ? true : false

  const autoSetDisabled = active === false ? true : false

  const state = {
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
    },

    noticeChange: (val: boolean) => {
      setNotice(val)
      settingService.setNotice(val)
    },

    privacyPress: () => {
      showBottomSheet('privacy')
    },
    termsPress: () => {
      showBottomSheet('terms')
    },
    consentPress: () => {
      showBottomSheet('consent')
    },
    consentThirdPress: () => {
      showBottomSheet('consent-third')
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
