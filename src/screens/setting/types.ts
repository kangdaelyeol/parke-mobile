import { ViewModel } from '@/types/common';

interface HeaderActions {
  backPress: () => void;
}

interface MainActions {
  autoSetChange: (val: boolean) => void;
  activeChange: (val: boolean) => void;
  noticeChange: (val: boolean) => void;
}

interface MainState {
  noticeDisabled: boolean;
  autoSetDisabled: boolean;
  notice: boolean;
  autoSet: boolean;
  active: boolean;
}

export type SettingHeaderViewModel = ViewModel<{}, HeaderActions>;

export type SettingMainViewModel = ViewModel<MainState, MainActions>;
