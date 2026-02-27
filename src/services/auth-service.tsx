import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';

interface kakaoProfile {
  email: string;
  nickname: string;
}

interface AuthService {
  getKakaoProfile: () => Promise<kakaoProfile | null>;
  kakaoLogin: () => Promise<kakaoProfile | null>;
  firebaseLogin: (email: string, password: string) => Promise<string | null>;
  firebaseSignIn: (email: string, password: string) => Promise<string | null>;
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
};
