import { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { RefWebView, WebViewHandle } from '@/components'
import { PARKE_WEB_URL } from '@/constants'
import { HomeCardWebPreviewProps } from '@home/types'
import { DARK, DARK_LIGHT, GRAY } from '@/theme/color'
import { PRETENDARD } from '@/theme/fonts'

// 입력이 멈춘 뒤 이 시간이 지나면 웹에 반영한다
const PREVIEW_DEBOUNCE_MS = 300
const PREVIEW_HEIGHT = 420

// 카드 수정 중인 값을 웹 카드 화면으로 바로 보여준다 (저장 전).
// 웹 연동 규칙:
//  1. 처음 열 때 URL에 ?preview=1&title=..&layout=.. 로 현재 값을 붙인다
//  2. 값이 바뀌면 페이지를 다시 불러오지 않고 window 'message' 이벤트로
//     { type: 'parke:preview', card } (JSON 문자열)를 보낸다
// 웹이 이를 지원하지 않으면 저장된 카드 화면이 그대로 보인다.
export const CardWebPreview = ({ cardId, card }: HomeCardWebPreviewProps) => {
  const webViewRef = useRef<WebViewHandle>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const latestCard = useRef(card)
  latestCard.current = card

  // URL은 처음 한 번만 만든다 (값이 바뀔 때마다 새로 불러오지 않도록)
  const uri = useMemo(() => {
    const params: Record<string, string> = {
      preview: '1',
      title: latestCard.current.title,
      phone: latestCard.current.phone,
      theme: latestCard.current.theme,
      layout: latestCard.current.layout,
      accent: latestCard.current.custom.accent,
      scale: String(latestCard.current.custom.scale),
      message: latestCard.current.custom.message,
    }
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    return `${PARKE_WEB_URL}${encodeURIComponent(cardId)}?${query}`
  }, [cardId])

  const sendPreview = () => {
    const message = JSON.stringify({
      type: 'parke:preview',
      card: { id: cardId, ...latestCard.current },
    })
    webViewRef.current?.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(
        message,
      )} }));true;`,
    )
  }

  useEffect(() => {
    if (loading) return
    const id = setTimeout(sendPreview, PREVIEW_DEBOUNCE_MS)
    return () => clearTimeout(id)
    // 카드 값이 바뀔 때만 보낸다 (sendPreview는 ref로 최신 값을 읽는다)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, loading])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>미리보기</Text>
      <View style={styles.frame}>
        <RefWebView
          ref={webViewRef}
          source={{ uri }}
          style={styles.webView}
          nestedScrollEnabled
          onLoadEnd={() => {
            setLoading(false)
            // 웹이 리스너를 붙인 뒤에도 최신 값이 반영되도록 한 번 더 보낸다
            sendPreview()
          }}
          onError={() => setFailed(true)}
        />
        {loading && !failed && (
          <View style={styles.overlay}>
            <ActivityIndicator color={GRAY} />
          </View>
        )}
        {failed && (
          <View style={styles.overlay}>
            <Text style={styles.failedText}>
              미리보기를 불러오지 못했습니다.
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.caption}>
        저장 전 화면입니다. QR을 스캔한 사람에게는 저장한 뒤에 보입니다.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  frame: {
    height: PREVIEW_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    overflow: 'hidden',
    backgroundColor: DARK,
  },
  webView: {
    flex: 1,
    backgroundColor: DARK,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DARK,
  },
  failedText: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  caption: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
})
