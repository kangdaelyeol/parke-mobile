import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth'
import {
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
  login,
  logout,
} from '@react-native-seoul/kakao-login'
import appleAuth from '@invertase/react-native-apple-authentication'
import { AuthService } from './types'
import { getHashedPassword } from '@/helpers'
import { cacheService } from './cache-service'

export const authService: AuthService = {
  getKakaoProfile: async () => {
    try {
      const profile: KakaoProfile = await getProfile()
      return { email: profile.email, nickname: profile.nickname }
    } catch (e) {
      return null
    }
  },
  kakaoLogin: async () => {
    try {
      const res: KakaoOAuthToken = await login()
      if (res) {
        return authService.getKakaoProfile()
      }
      return null
    } catch (e) {
      return null
    }
  },
  appleLogin: async () => {
    if (!appleAuth.isSupported) return null
    try {
      const credential = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      if (!credential) return null

      return credential.user
    } catch (e) {
      console.log(e)
      return null
    }
  },
  kakaoLogout: async () => {
    await logout()
    cacheService.clearLoginProvider()
  },
  appleLogout: () => {
    cacheService.clearAppleUser()
    cacheService.clearLoginProvider()
  },
  firebaseLogin: async email => {
    const password = getHashedPassword(email)
    try {
      const cred = await signInWithEmailAndPassword(getAuth(), email, password)
      return cred.user.uid
    } catch (e) {
      console.log(e)
      return null
    }
  },
  firebaseSignIn: async email => {
    const password = getHashedPassword(email)
    try {
      const cred = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      )
      return cred.user.uid
    } catch (e) {
      return null
    }
  },
  firebaseSignOut: async () => {
    await signOut(getAuth())
  },
  firebaseDeleteUser: async () => {
    const user = getAuth().currentUser
    if (user) await deleteUser(user)
  },
  autoLogin: async () => {
    const loginProvider = cacheService.getLoginProvider()
    if (!loginProvider) return null

    switch (loginProvider) {
      case 'apple':
        const appleUser = cacheService.getAppleUser()
        if (!appleUser) return null

        const appleUid = await authService.firebaseLogin(appleUser)
        if (appleUid) return appleUid
        break
      case 'kakao':
        const kakaoProfile = await authService.getKakaoProfile()
        if (!kakaoProfile) return null

        const kakaoUid = await authService.firebaseLogin(kakaoProfile.email)
        if (kakaoUid) return kakaoUid
        break
    }

    return null
  },
  signInOrLogin: async (identifier, provider) => {
    const uid = await authService.firebaseSignIn(identifier)
    if (uid) {
      cacheService.setLoginProvider(provider)
      return uid
    }

    const loginUid = await authService.firebaseLogin(identifier)
    if (loginUid) {
      cacheService.setLoginProvider(provider)
      return loginUid
    }

    return null
  },
  signOut: async () => {
    const loginProvider = cacheService.getLoginProvider()
    if (!loginProvider) return false

    switch (loginProvider) {
      case 'apple':
        try {
          await authService.firebaseSignOut()
          authService.appleLogout()
          return true
        } catch (e) {
          console.log(e)
          return false
        }
      case 'kakao':
        try {
        } catch (e) {
          console.log(e)
          return false
        }
        await authService.kakaoLogout()
        await authService.firebaseSignOut()
        return true
    }
  },
  clearAuth: async () => {
    await Promise.allSettled([
      authService.kakaoLogout(),
      authService.firebaseSignOut(),
      authService.appleLogout(),
    ])
    cacheService.clearLoginProvider()
  },
}
