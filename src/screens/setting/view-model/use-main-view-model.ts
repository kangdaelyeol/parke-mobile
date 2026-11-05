import { useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import {
  bleService,
  cacheService,
  legalService,
  settingService,
} from '@/services'
import { DocType } from '@/types/common'
import { ThemeId } from '@/theme/themes'
import { SettingMainViewModel } from '@setting/types'
import { useAppTheme, useUserContext } from '@/contexts'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SettingStackNavigationProp } from '@/navigation/types'
import { resetRoot } from '@/navigation/actions'
import { SHOW_THEME_GALLERY } from '@/constants'

export const useMainViewModel = (): SettingMainViewModel => {
  const { user, validateUser } = useUserContext()
  const locationAgreed = legalService.hasLocationConsent(user?.consents)
  const [autoSet, setAutoSet] = useState(false)
  const [notice, setNotice] = useState(false)
  const [active, setActive] = useState(true)

  const navigation = useNavigation<SettingStackNavigationProp>()
  const { theme, themes, selectTheme } = useAppTheme()

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
          navigation.dispatch(resetRoot('Login'))
        }
      })()
    }, [validateUser, navigation]),
  )

  const noticeDisabled = active === false || autoSet === false ? true : false

  const autoSetDisabled = active === false ? true : false

  const state = {
    locationAgreed,
    noticeDisabled,
    autoSetDisabled,
    notice,
    autoSet,
    active,
    themes,
    themeId: theme.id,
    showThemeGallery: SHOW_THEME_GALLERY,
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
    consentSettingPress: () => navigation.navigate('ConsentSetting'),
    onBoardingPress: () => {
      cacheService.setHasSeenOnBoarding(false)
      navigation.dispatch(resetRoot('OnBoarding'))
    },
    themeSelect: selectTheme,
    themeGalleryPress: (themeId: ThemeId) =>
      navigation.navigate('ThemeGallery', { themeId }),
  }

  return {
    state,
    actions,
  }
}
