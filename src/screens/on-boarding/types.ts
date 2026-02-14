import { ViewModel } from '@/types/common';

export type ScreenViewModel = ViewModel<
  {
    loading: boolean;
  },
  {}
>;

interface FooterState {
  pageIdx: number;
}

interface FooterActions {
  nextPress: () => void;
  dotPress: (idx: number) => void;
  startPress: () => void;
}

export type OnBoardingFooterViewModel = ViewModel<FooterState, FooterActions>