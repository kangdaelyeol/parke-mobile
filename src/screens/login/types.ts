import { ViewModel } from '@/types/common';

interface LoginActions {
  kakaoLoginPress: () => Promise<void>;
}

interface LoginState {
  loading: boolean;
}

export type LoginViewModel = ViewModel<LoginState, LoginActions>;
