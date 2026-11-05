import { StyleSheet, View, ScrollView } from 'react-native'
import { useMainViewModel } from '@setting/view-model'
import {
  GlassRow,
  Item,
  ItemDivider,
  ItemList,
  SectionLabel,
  StatusPill,
} from '@/components'
import { LEGAL_DOCS } from '@/constants'
import { useTabBarLayout } from '@/hooks'
import { ThemeCard } from './theme-card'
import { DocType } from '@/types/common'

// 설정 화면에 보여줄 법률 문서 순서
const DOC_MENU: DocType[] = [
  'privacy',
  'terms',
  'location',
  'consent',
  'location-consent',
  'consent-third',
]

export const Main = () => {
  const { state, actions } = useMainViewModel()
  const { space } = useTabBarLayout()
  return (
    // 아래 탭바에 가리지 않도록 탭바만큼 더 비워 둔다
    <ScrollView contentContainerStyle={{ paddingBottom: space }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <SectionLabel>테마</SectionLabel>
          {state.themes.map(theme => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              selected={theme.id === state.themeId}
              onPress={() => actions.themeSelect(theme.id)}
            />
          ))}
          {state.showThemeGallery && (
            <ItemList>
              <GlassRow
                icon="swatchbook"
                tone="accent"
                title="구성 요소 보기"
                subtitle="이 테마에 담긴 판·버튼·차트·표를 한 화면에서"
                chevron
                onPress={() => actions.themeGalleryPress(state.themeId)}
              />
            </ItemList>
          )}
        </View>
        <View style={styles.section}>
          <SectionLabel>일반</SectionLabel>
          <ItemList>
            <Item
              title="자동변경"
              subTitle="장치 감지시 자동 업데이트"
              option="bluetooth"
              disabled={state.autoSetDisabled}
              value={state.autoSet}
              onValueChange={actions.autoSetChange}
            />
            <ItemDivider />
            <Item
              title="알림"
              subTitle="푸시 알림 수신"
              option="notify"
              disabled={state.noticeDisabled}
              value={state.notice}
              onValueChange={actions.noticeChange}
            />
          </ItemList>
        </View>
        <View style={styles.section}>
          <SectionLabel>서비스</SectionLabel>
          <ItemList>
            <Item
              title="활성화"
              subTitle="서비스 활성화 상태"
              option="active"
              value={state.active}
              onValueChange={actions.activeChange}
            />
          </ItemList>
        </View>
        <View style={styles.section}>
          <SectionLabel>위치정보</SectionLabel>
          <ItemList>
            <GlassRow
              icon="location-dot"
              tone="warning"
              title="주행 모드 위치정보 동의"
              divider
              right={
                <StatusPill
                  variant="plain"
                  dot
                  tone={state.locationAgreed ? 'success' : 'neutral'}
                  label={state.locationAgreed ? '동의함' : '동의하지 않음'}
                />
              }
            />
            {/* 법률 문서의 철회 안내("앱 설정 → 위치정보 동의 철회")와 같은 이름을 쓴다 */}
            <GlassRow
              icon="sliders"
              title="위치정보 동의 철회"
              chevron
              onPress={actions.consentSettingPress}
            />
          </ItemList>
        </View>
        <View style={styles.section}>
          <SectionLabel>약관 및 정책</SectionLabel>
          <ItemList>
            {DOC_MENU.map((docType, i) => (
              <GlassRow
                key={docType}
                title={LEGAL_DOCS[docType].title}
                chevron
                divider={i < DOC_MENU.length - 1}
                onPress={() => actions.docPress(docType)}
              />
            ))}
          </ItemList>
        </View>
        <View style={styles.section}>
          <SectionLabel>버전</SectionLabel>
          <ItemList>
            <GlassRow icon="code-branch" title="현재 버전" value="1.0.0 Beta" />
          </ItemList>
        </View>
        <View style={styles.section}>
          <SectionLabel>기타</SectionLabel>
          <ItemList>
            <GlassRow
              icon="book-open"
              title="온보딩 화면 보기"
              chevron
              onPress={actions.onBoardingPress}
            />
          </ItemList>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 14,
    paddingBottom: 40,
    marginHorizontal: 'auto',
  },
  section: {
    marginTop: 28,
  },
})
