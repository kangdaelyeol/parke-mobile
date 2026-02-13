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

export type HeaderViewModel = ViewModel<
  {},
  {
    backPress: () => void;
  }
>;

export type MainViewModel = ViewModel<MainState, MainActions>;

export interface ProfileViewModel {
  main: MainViewModel;
  header: HeaderViewModel;
}
