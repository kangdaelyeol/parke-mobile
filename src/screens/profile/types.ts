import { ViewModel } from '@/types/common';

interface MainActions {
  nicknameInput: (v: string) => void;
  phoneInput: (v: string) => void;
  savePress: () => Promise<void>;
  logoutPress: () => Promise<void>;
  deletePress: () => Promise<void>;
}

interface MainState {
  loading: boolean;
  nickname: string;
  phone: string;
}

interface HeaderActions {
  backPress: () => void;
}

export type HeaderViewModel = ViewModel<{}, HeaderActions>;

export type MainViewModel = ViewModel<MainState, MainActions>;
