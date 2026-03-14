import { useEffect, useState } from 'react'
import { settingService } from '@/services'
import { SettingMainViewModel } from '@setting/types'

export const useSettingMainViewModel = (): SettingMainViewModel => {
  const [autoSet, setAutoSet] = useState(false)
  const [notice, setNotice] = useState(false)
  const [active, setActive] = useState(true)

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
  }

  return {
    state,
    actions,
  }
}
