import { ViewModel } from '@/types/common';

interface HeaderActions {
  backPress: () => void;
}

export type SearchBLEHeaderViewModel = ViewModel<{}, HeaderActions>;
