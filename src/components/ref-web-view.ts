import { ComponentType, Ref } from 'react'
import { WebView, WebViewProps } from 'react-native-webview'

// react-native-webview의 기본 타입 선언에 ref가 빠져 있어,
// 실제로 쓰는 메서드만 가진 ref 타입을 붙인 WebView
export interface WebViewHandle {
  injectJavaScript: (script: string) => void
  reload: () => void
}

export const RefWebView = WebView as unknown as ComponentType<
  WebViewProps & { ref?: Ref<WebViewHandle> }
>
