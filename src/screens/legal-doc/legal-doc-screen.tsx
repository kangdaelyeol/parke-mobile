import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { WebViewMessageEvent } from 'react-native-webview'
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes'
import { PressableButton, RefWebView, WebViewHandle } from '@/components'
import { LEGAL_DOCS } from '@/constants'
import {
  LegalDocStackNavigationProp,
  RootStackParamList,
} from '@/navigation/types'
import { legalService } from '@/services'
import { DARK, GRAY, WHITE, SCREEN_BACKGROUND } from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { EXTRACT_DOC_JS, HIDE_UNTIL_READY_JS } from './legal-doc-scripts'

type LegalDocScreenProps = {
  route: RouteProp<RootStackParamList, 'LegalDoc'>
}

// 법률 문서 화면. 웹(originalshq.com)의 문서를 띄우고 본문만 보여준다
export default function LegalDocScreen({ route }: LegalDocScreenProps) {
  const { docType } = route.params
  const navigation = useNavigation<LegalDocStackNavigationProp>()
  const { top } = useSafeAreaInsets()
  const webViewRef = useRef<WebViewHandle>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const retry = () => {
    setFailed(false)
    setLoading(true)
    webViewRef.current?.reload()
  }

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data)
      if (msg.type === 'ready') setLoading(false)
      // 동의 기록에 남길 시행일
      if (msg.type === 'effectiveDate')
        legalService.rememberEffectiveDate(docType, String(msg.value))
      if (msg.type === 'notFound') {
        setLoading(false)
        setFailed(true)
      }
    } catch {}
  }

  // 문서 주소만 앱 안에서 열고, 문서 속 외부 링크는 외부 브라우저로 넘긴다
  const onShouldStartLoadWithRequest = (req: ShouldStartLoadRequest) => {
    if (req.isTopFrame === false) return true
    if (legalService.isLegalDocUrl(req.url) || req.url.startsWith('about:'))
      return true
    Linking.openURL(req.url).catch(() => {})
    return false
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable
          hitSlop={12}
          onPress={navigation.goBack}
          style={styles.backButton}
        >
          <FontAwesome6
            name="angle-left"
            iconStyle="solid"
            size={20}
            color={WHITE}
          />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {LEGAL_DOCS[docType].title}
        </Text>
      </View>

      <View style={styles.body}>
        <RefWebView
          ref={webViewRef}
          source={{ uri: legalService.getDocUrl(docType) }}
          injectedJavaScriptBeforeContentLoaded={HIDE_UNTIL_READY_JS}
          injectedJavaScript={EXTRACT_DOC_JS}
          onMessage={onMessage}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onError={() => {
            setLoading(false)
            setFailed(true)
          }}
          onHttpError={e => {
            if (e.nativeEvent.statusCode >= 400) {
              setLoading(false)
              setFailed(true)
            }
          }}
          style={styles.webView}
        />
        {loading && !failed && (
          <View style={styles.overlay}>
            <ActivityIndicator color={GRAY} />
          </View>
        )}
        {failed && (
          <View style={styles.overlay}>
            <Text style={styles.failedText}>문서를 불러오지 못했습니다</Text>
            <Text style={styles.failedSub}>네트워크 연결을 확인해주세요</Text>
            <PressableButton
              variant="secondary"
              title="다시 시도"
              onPress={retry}
              pressableStyle={styles.retry}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: DARK,
  },
  backButton: {
    width: 28,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 17,
  },
  body: {
    flex: 1,
  },
  // 로딩 중 흰 화면이 번쩍이지 않도록 검은 배경
  webView: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: SCREEN_BACKGROUND,
  },
  failedText: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  failedSub: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  retry: {
    marginTop: 12,
    width: 160,
  },
})
