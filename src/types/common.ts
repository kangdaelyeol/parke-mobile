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

// 문서별 동의 기록 (user/{uid}/consents/{docType})
export interface ConsentRecord {
  agreed: boolean
  agreedAt: number // 서버 시각 (ms)
  effectiveDate: string // 동의한 문서의 시행일, YYYY-MM-DD
}
