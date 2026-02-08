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
  return (
    <authContext.Provider value={{ getKakaoProfile, kakaoLogin }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => useContext(authContext);
