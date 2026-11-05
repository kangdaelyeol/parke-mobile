import { useEffect, useState } from 'react'
import { AppState } from 'react-native'

// 지금 시각. intervalMs마다, 그리고 앱이 다시 앞으로 나올 때 갱신된다
// ("n분 전"처럼 시간이 흐르면 달라지는 표시가 화면에 머무는 동안에도 맞게)
export const useNow = (intervalMs: number) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const timer = setInterval(tick, intervalMs)
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') tick()
    })
    return () => {
      clearInterval(timer)
      sub.remove()
    }
  }, [intervalMs])

  return now
}
