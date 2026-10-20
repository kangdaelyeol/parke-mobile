import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WebViewMessageEvent } from 'react-native-webview'
import { RefWebView, WebViewHandle } from '@/components'
import { KAKAO_MAP_BASE_URL, KAKAO_MAP_JS_KEY } from '@/constants'
import { DriveMapProps } from '@/screens/drive/types'
import { buildMapHtml } from '@/screens/drive/map-html'
import { DARK, GRAY } from '@/theme/color'
import { PRETENDARD } from '@/theme/fonts'

const MAP_LOAD_TIMEOUT_MS = 10 * 1000

export const DriveMap = ({
  ref,
  phase,
  points,
  current,
  accent,
}: DriveMapProps) => {
  const webViewRef = useRef<WebViewHandle>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(
    KAKAO_MAP_JS_KEY ? '' : '카카오맵 JavaScript 키가 설정되지 않았습니다.',
  )
  // 지도에 이미 그린 점 개수. 새 점만 보낸다.
  const sentCount = useRef(0)
  const html = useMemo(() => buildMapHtml(accent), [accent])

  const run = (script: string) =>
    webViewRef.current?.injectJavaScript(`${script};true;`)

  useImperativeHandle(ref, () => ({
    recenter: () => run('window.recenter && window.recenter()'),
  }))

  // 키나 도메인 등록이 잘못되면 지도 스크립트가 조용히 실패하므로 시간 제한을 둔다
  useEffect(() => {
    if (ready || error) return
    const id = setTimeout(
      () =>
        setError(
          '지도를 불러오지 못했습니다. 네트워크와 지도 키 설정을 확인해주세요.',
        ),
      MAP_LOAD_TIMEOUT_MS,
    )
    return () => clearTimeout(id)
  }, [ready, error])

  useEffect(() => {
    if (!ready) return
    const toLatLng = points.map(p => [p.latitude, p.longitude])

    if (phase === 'summary') {
      run(`window.showSummary(${JSON.stringify(toLatLng)})`)
      return
    }

    if (sentCount.current === 0 || sentCount.current > points.length) {
      run(`window.setPath(${JSON.stringify(toLatLng)})`)
    } else {
      points
        .slice(sentCount.current)
        .forEach(p => run(`window.addPoint(${p.latitude},${p.longitude})`))
    }
    sentCount.current = points.length
  }, [ready, phase, points])

  // 현재 위치 점은 경로와 별개로 매번 옮긴다
  useEffect(() => {
    if (!ready || phase !== 'driving' || !current) return
    run(`window.setCurrent(${current.latitude},${current.longitude})`)
  }, [ready, phase, current])

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data)
      if (msg.type === 'ready') setReady(true)
      if (msg.type === 'error') {
        console.log('[DriveMap]', msg.message, msg.detail ?? '')
        setError(msg.message)
      }
    } catch {}
  }

  return (
    <View style={styles.container}>
      {!!KAKAO_MAP_JS_KEY && (
        <RefWebView
          ref={webViewRef}
          source={{ html, baseUrl: KAKAO_MAP_BASE_URL }}
          originWhitelist={['*']}
          onMessage={onMessage}
          javaScriptEnabled
          style={styles.webView}
        />
      )}
      {!!error && (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>{error}</Text>
          <Text style={styles.fallbackSub}>
            경로와 주행 기록은 계속 측정됩니다.
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },
  webView: {
    flex: 1,
    backgroundColor: DARK,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
    backgroundColor: DARK,
  },
  fallbackText: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
    textAlign: 'center',
  },
  fallbackSub: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
})
