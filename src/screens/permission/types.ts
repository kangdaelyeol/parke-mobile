import { ViewModel } from '@/types/common'

interface FooterActions {
  onConfirmPress: () => void
}

export type PermissionFooterViewModel = ViewModel<{}, FooterActions>
