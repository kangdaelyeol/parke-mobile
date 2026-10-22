export type ViewModel<S, A> = Readonly<{
  state: Readonly<S>
  actions: Readonly<A>
}>

type WithAnimated<VM extends object, M> = Readonly<
  VM & { animated: Readonly<M> }
>

export type AnimatedViewModel<S, A, M> = WithAnimated<ViewModel<S, A>, M>

// 법률 문서 종류 (웹 https://originalshq.com/privacy/parke/{path}와 1:1)
export type DocType =
  | 'privacy'
  | 'terms'
  | 'location'
  | 'consent'
  | 'location-consent'
  | 'consent-third'

// 동의 기록 키: 법률 문서 + 만 14세 이상 확인(문서 없음)
export type ConsentKey = DocType | 'age'

// 동의 기록 (user/{uid}/consents/{key})
export interface ConsentRecord {
  agreed: boolean
  agreedAt: number // 서버 시각 (ms)
  // 동의한 문서의 시행일, YYYY-MM-DD.
  // 'age'는 문서가 없어 '', 개정 전 앱 내 약관 동의는 LEGACY_CONSENT_EFFECTIVE_DATE
  effectiveDate: string
}

export type ConsentMap = Partial<Record<ConsentKey, ConsentRecord>>
