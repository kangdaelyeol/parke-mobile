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
import { AuthService } from './types';

export const authService: AuthService = {
  getKakaoProfile: async () => {
    try {
      const profile: KakaoProfile = await getProfile();
      return { email: profile.email, nickname: profile.nickname };
    } catch (e) {
      return null;
    }
  },
  kakaoLogin: async () => {
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
  kakaoLogout: async () => {
    await logout();
  },
  firebaseLogin: async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(getAuth(), email, password);
      return cred.user.uid;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  firebaseSignIn: async (email, password) => {
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

  firebaseSignOut: async () => {
    await signOut(getAuth());
  },
  firebaseDeleteUser: async () => {
    const user = getAuth().currentUser;
    if (user) await deleteUser(user);
  },
};
