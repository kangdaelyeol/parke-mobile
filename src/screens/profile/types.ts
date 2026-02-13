export interface HeaderProps {
  handleBackPress: () => void;
}
interface MainAction {
  nicknameInput: (v: string) => void;
  phoneInput: (v: string) => void;
  savePress: () => Promise<void>;
  logoutPress: () => Promise<void>;
  deletePress: () => Promise<void>;
}

interface MainViewModel {
  loading: boolean;
  nickname: string;
  handlers: MainAction;
  phone: string;
}

export interface MainProps {
  viewModel: MainViewModel;
}