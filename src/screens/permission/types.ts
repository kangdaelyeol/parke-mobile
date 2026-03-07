import { ViewModel } from '@/types/common'

interface FooterActions {
  onConfirmPress: () => Promise<void>
}

export type PermissionFooterViewModel = ViewModel<{}, FooterActions>
