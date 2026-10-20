import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { RefWebView } from '@/components'
import { PARKE_WEB_URL } from '@/constants'
import { HomeCardWebPreviewProps } from '@home/types'
import { DARK, DARK_LIGHT, GRAY } from '@/theme/color'
import { PRETENDARD } from '@/theme/fonts'

// 입력이 멈춘 뒤 이 시간이 지나면 새 값으로 다시 불러온다
const PREVIEW_RELOAD_DEBOUNCE_MS = 500
const PREVIEW_HEIGHT = 640

// 수정 중인 값을 쿼리 파라미터로 붙인 웹 카드 주소.
// 웹은 preview=1이면 Firebase 저장값 대신 쿼리 값으로 화면을 그린다.
const buildPreviewUri = (
  cardId: string,
  card: HomeCardWebPreviewProps['card'],
) => {
  const params: Record<string, string> = {
    preview: '1',
    title: card.title,
    phone: card.phone,
    theme: card.theme,
    layout: card.layout,
    accent: card.custom.accent,
    scale: String(card.custom.scale),
    message: card.custom.message,
  }
  const query = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `${PARKE_WEB_URL}${encodeURIComponent(cardId)}?${query}`
}

// 카드 수정 중인 값을 웹 카드 화면으로 미리 보여준다 (저장 전).
// 값이 바뀌면 바뀐 쿼리로 웹뷰를 다시 불러온다.
export const CardWebPreview = ({ cardId, card }: HomeCardWebPreviewProps) => {
  const [uri, setUri] = useState(() => buildPreviewUri(cardId, card))
  const [loading, setLoading] = useState(true)
  const [loadedOnce, setLoadedOnce] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const next = buildPreviewUri(cardId, card)
    if (next === uri) return
    const id = setTimeout(() => setUri(next), PREVIEW_RELOAD_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [cardId, card, uri])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>미리보기</Text>
      <View style={styles.frame}>
        <RefWebView
          source={{ uri }}
          style={styles.webView}
          nestedScrollEnabled
          onLoadStart={() => {
            setLoading(true)
            setFailed(false)
          }}
          onLoadEnd={() => {
            setLoading(false)
            setLoadedOnce(true)
          }}
          onError={() => setFailed(true)}
        />
        {/* 처음에는 전체를 가리고, 다시 불러올 때는 이전 화면 위에 작게 표시한다 */}
        {loading && !loadedOnce && !failed && (
          <View style={styles.overlay}>
            <ActivityIndicator color={GRAY} />
          </View>
        )}
        {loading && loadedOnce && !failed && (
          <View style={styles.reloading}>
            <ActivityIndicator size="small" color={GRAY} />
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
  reloading: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 12,
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
