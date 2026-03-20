import { useRef, useState } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { DocType } from '@/types/common'

interface UseTermBottomSheet {
  docType: DocType
  modalRef: React.RefObject<BottomSheetModal | null>
  showBottomSheet: (type: DocType) => void
}

export const useTermBottomSheet = (): UseTermBottomSheet => {
  const [docType, setDocType] = useState<DocType>('terms')

  const modalRef = useRef<BottomSheetModal>(null)
  const showBottomSheet = (type: DocType) => {
    setDocType(type)
    modalRef.current?.present()
  }

  return { docType, modalRef, showBottomSheet }
}
