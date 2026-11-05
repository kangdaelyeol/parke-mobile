import { ReactNode } from 'react'
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassTitleBar } from '@/theme/themes/glass-dashboard/components/glass-title-bar'
import { GLASS_LAYOUT, glassStyles } from '@/theme/glass'
import { SCREEN_BACKGROUND } from '@/theme/color'
import { Loading } from './loading'

interface GlassScreenHeaderProps {
  title: string
  // 있으면 왼쪽에 ‹ (하위 화면)
  onBack?: () => void
  // 제목 막대 오른쪽에 둘 버튼·알약
  right?: ReactNode
}

// 글래스 화면 머리: 상태 표시줄 아래, 본문과 같은 폭의 제목 막대
export const GlassScreenHeader = ({
  title,
  onBack,
  right,
}: GlassScreenHeaderProps) => {
  const { top } = useSafeAreaInsets()
  return (
    <View
      style={[
        glassStyles.column,
        styles.header,
        { paddingTop: top + GLASS_LAYOUT.topGap },
      ]}
    >
      <GlassTitleBar title={title} onBack={onBack} right={right} />
    </View>
  )
}

interface GlassScreenProps extends GlassScreenHeaderProps {
  // true: 본문이 길면 화면 전체가 스크롤된다
  // false(기본): 본문이 남은 높이를 채우고, 안쪽(표·지도)이 알아서 스크롤한다
  scroll?: boolean
  // 본문 대신 화면 전체에 로딩을 띄운다
  loading?: boolean
  // 본문 끝과 홈 인디케이터 사이 여백
  bottomGap?: number
  bodyStyle?: StyleProp<ViewStyle>
  children?: ReactNode
}

// 글래스 하위 화면 틀: 검은 바탕 + 제목 막대 + 가운데 본문 칸. 새 화면은 본문만 만들면 된다
export const GlassScreen = ({
  title,
  onBack,
  right,
  scroll = false,
  loading = false,
  bottomGap = 16,
  bodyStyle,
  children,
}: GlassScreenProps) => {
  const { bottom } = useSafeAreaInsets()
  const body = [
    glassStyles.column,
    styles.body,
    { paddingBottom: bottom + bottomGap },
    bodyStyle,
  ]

  return (
    <View style={styles.screen}>
      <GlassScreenHeader title={title} onBack={onBack} right={right} />
      {loading ? (
        <Loading />
      ) : scroll ? (
        <ScrollView contentContainerStyle={body}>{children}</ScrollView>
      ) : (
        <View style={[styles.fill, body]}>{children}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  header: {
    paddingBottom: 4,
  },
  body: {
    paddingTop: GLASS_LAYOUT.topGap,
  },
  fill: {
    flex: 1,
  },
})
