import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import {
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
  login,
  logout,
} from '@react-native-seoul/kakao-login';

interface kakaoProfile {
  email: string;
  nickname: string;
}

interface AuthService {
  firebaseLogin: (email: string, password: string) => Promise<string | null>;
  firebaseSignIn: (email: string, password: string) => Promise<string | null>;
  firebaseSignOut: () => Promise<void>;
  firebaseDeleteUser: () => Promise<void>;
  kakaoLogin: () => Promise<kakaoProfile | null>;
  kakaoLogout: () => Promise<void>;
  getKakaoProfile: () => Promise<kakaoProfile | null>;
}

export const authService: AuthService = {
  getKakaoProfile: async (): Promise<kakaoProfile | null> => {
    try {
      const profile: KakaoProfile = await getProfile();
      return { email: profile.email, nickname: profile.nickname };
    } catch (e) {
      return null;
    }
  },
  kakaoLogin: async (): Promise<kakaoProfile | null> => {
    try {
      const res: KakaoOAuthToken = await login();
      if (res) {
        const profile: KakaoProfile = await getProfile();
        return { email: profile.email, nickname: profile.nickname };
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  kakaoLogout: async (): Promise<void> => {
    await logout();
  },
  firebaseLogin: async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const cred = await signInWithEmailAndPassword(getAuth(), email, password);
      return cred.user.uid;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  firebaseSignIn: async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const cred = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      );
      return cred.user.uid;
    } catch (e) {
      return null;
    }
  },

  firebaseSignOut: async (): Promise<void> => {
    await signOut(getAuth());
  },
  firebaseDeleteUser: async () => {
    const user = getAuth().currentUser;
    if (user) await deleteUser(user);
  },
};
