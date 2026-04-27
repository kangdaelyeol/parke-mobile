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
import { formatToAppleEmail, getHashedPassword } from '@/helpers'
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
        cacheService.setLoginProvider('kakao')
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
      console.log(credential)
      if (!credential) return null

      const formattedEmail = formatToAppleEmail(credential.user)

      cacheService.setAppleUser(formattedEmail)
      cacheService.setLoginProvider('apple')
      return formattedEmail
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
      return { status: true, payload: cred.user.uid }
    } catch (e) {
      console.log(e)
      return { status: false, payload: null }
    }
  },
  firebaseSignUp: async email => {
    const password = getHashedPassword(email)
    try {
      const cred = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password,
      )
      return { status: true, payload: cred.user.uid }
    } catch (e) {
      console.log(e)
      return { status: false, payload: null }
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

        const appleRes = await authService.firebaseLogin(appleUser)
        if (appleRes.status) return appleRes.payload
        break
      case 'kakao':
        const kakaoProfile = await authService.getKakaoProfile()
        if (!kakaoProfile) return null

        const kakaoRes = await authService.firebaseLogin(kakaoProfile.email)
        if (kakaoRes.status) return kakaoRes.payload
        break
    }

    return null
  },
  signInOrLogin: async identifier => {
    const signUpRes = await authService.firebaseSignUp(identifier)
    if (signUpRes.status) {
      return signUpRes.payload
    }

    const loginRes = await authService.firebaseLogin(identifier)
    if (loginRes.status) {
      return loginRes.payload
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
          cacheService.clearLoginProvider()
          return true
        } catch (e) {
          console.log(e)
          return false
        }
      case 'kakao':
        try {
          await authService.firebaseSignOut()
          await authService.kakaoLogout()
          cacheService.clearLoginProvider()
        } catch (e) {
          console.log(e)
          return false
        }
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
