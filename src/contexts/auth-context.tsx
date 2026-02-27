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
import { createContext, PropsWithChildren, useContext } from 'react';

interface kakaoProfile {
  email: string;
  nickname: string;
}

interface AuthContext {
  getKakaoProfile: () => Promise<kakaoProfile | null>;
  kakaoLogin: () => Promise<kakaoProfile | null>;
  firebaseLogin: (email: string, password: string) => Promise<string | null>;
  firebaseSignIn: (email: string, password: string) => Promise<string | null>;
}

const authContext = createContext({} as AuthContext);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const getKakaoProfile = async (): Promise<kakaoProfile | null> => {
    try {
      const profile: KakaoProfile = await getProfile();
      return { email: profile.email, nickname: profile.nickname };
    } catch (e) {
      return null;
    }
  };
  const kakaoLogin = async (): Promise<kakaoProfile | null> => {
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
  };
  const firebaseLogin = async (
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
  };

  const firebaseSignIn = async (
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
  };
  return (
    <authContext.Provider
      value={{ getKakaoProfile, kakaoLogin, firebaseLogin, firebaseSignIn }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => useContext(authContext);
