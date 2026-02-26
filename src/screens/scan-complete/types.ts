import { ViewModel } from '@/types/common';

interface ScanCompleteState {
  currentStep: number;
}

export type ScanCompleteViewModel = ViewModel<ScanCompleteState, {}>;
