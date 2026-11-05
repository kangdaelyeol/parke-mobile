import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassIconButton } from '@/components'
import { RootStackParamList } from '@/navigation/types'
import { PRETENDARD } from '@/theme/fonts'
import { glassText, TEXT } from '@/theme/glass'
import {
  AnalyticsSample,
  AreaChartSample,
  CodeSample,
  DirectorySample,
  DonutSample,
  ElementsSample,
  FormSample,
  GallerySection,
  LogSample,
  SidebarSample,
  StatsSample,
  TableSample,
  ToolbarSample,
} from './components'
import { useThemeGalleryViewModel } from './view-model'

type ThemeGalleryScreenProps = {
  route: RouteProp<RootStackParamList, 'ThemeGallery'>
}

// 테마에 담긴 컴포넌트 전체 보기: 영상 대시보드의 화면들을 모바일 폭에 맞춰 그대로 옮겼다
export default function ThemeGalleryScreen({ route }: ThemeGalleryScreenProps) {
  const { state, actions } = useThemeGalleryViewModel(route.params.themeId)
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + 14 }]}>
        <GlassIconButton
          round
          size={36}
          icon="chevron-left"
          onPress={actions.backPress}
        />
        <View style={styles.headerTexts}>
          <Text style={styles.title} numberOfLines={1}>
            {state.theme.name}
          </Text>
          <Text style={glassText.subtitle} numberOfLines={1}>
            구성 요소 · {state.theme.source}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <GallerySection label="사이드바 · 메뉴">
          <SidebarSample active={state.nav} onSelect={actions.navPress} />
        </GallerySection>
        <GallerySection label="상단 바">
          <ToolbarSample
            search={state.search}
            onSearch={actions.searchInput}
            range={state.range}
            onRange={actions.rangeChange}
          />
        </GallerySection>
        <GallerySection label="통계 카드">
          <StatsSample />
        </GallerySection>
        <GallerySection label="영역 차트">
          <AreaChartSample
            tab={state.chartTab}
            onTab={actions.chartTabChange}
          />
        </GallerySection>
        <GallerySection label="도넛 차트">
          <DonutSample />
        </GallerySection>
        <GallerySection label="표 · 필터">
          <TableSample
            filter={state.filter}
            onFilter={actions.filterChange}
            rows={state.challenges}
          />
        </GallerySection>
        <GallerySection label="실시간 로그">
          <LogSample />
        </GallerySection>
        <GallerySection label="분석 화면">
          <AnalyticsSample
            range={state.waveRange}
            onRange={actions.waveRangeChange}
          />
        </GallerySection>
        <GallerySection label="입력 폼 · 상태 타일">
          <FormSample phone={state.phone} onPhone={actions.phoneInput} />
        </GallerySection>
        <GallerySection label="사용자 목록">
          <DirectorySample />
        </GallerySection>
        <GallerySection label="버튼 · 알약 · 타일">
          <ElementsSample />
        </GallerySection>
        <GallerySection label="코드 창">
          <CodeSample />
        </GallerySection>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    width: '100%',
    maxWidth: 420,
    marginHorizontal: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTexts: {
    flexShrink: 1,
    gap: 2,
  },
  title: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    marginHorizontal: 'auto',
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 26,
  },
})
