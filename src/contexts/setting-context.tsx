import { createContext, PropsWithChildren, useContext } from 'react'
import { useTermBottomSheet } from '@/hooks'
import { DocType } from '@/types/common'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

interface SettingContextValue {
  docType: DocType
  modalRef: React.RefObject<BottomSheetModal | null>
  showBottomSheet: (type: DocType) => void
}

const SettingContext = createContext({} as SettingContextValue)

export const SettingContextProvider = ({ children }: PropsWithChildren) => {
  const { docType, modalRef, showBottomSheet } = useTermBottomSheet()
  return (
    <SettingContext.Provider value={{ docType, modalRef, showBottomSheet }}>
      {children}
    </SettingContext.Provider>
  )
}

export const useSettingContext = () => useContext(SettingContext)
