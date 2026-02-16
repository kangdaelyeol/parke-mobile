import { ViewModel } from "@/types/common";

interface InitActions {
  phoneInput: (val: string) => void;
  nicknameInput: (val: string) => void;
  savePress: () => Promise<void>;
  skipPress: () => void;
}

interface InitState {
  nickname: string;
  phone: string;
  loading: boolean;
}

export type InitViewModel = ViewModel<InitState, InitActions>
