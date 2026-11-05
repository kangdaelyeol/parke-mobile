import { StyleSheet, View, ScrollView } from 'react-native'
import { useMainViewModel } from '@setting/view-model'
import {
  GlassRow,
  GlassSection,
  Item,
  ItemDivider,
  StatusPill,
} from '@/components'
import { LEGAL_DOCS } from '@/constants'
import { useTabBarLayout } from '@/hooks'
import { ThemeSection } from './theme-section'
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

// 설정 본문 (글래스): 묶음 이름 + 유리 판 목록
export const GlassMain = () => {
  const { state, actions } = useMainViewModel()
  const { space } = useTabBarLayout()
  return (
    // 아래 탭바에 가리지 않도록 탭바만큼 더 비워 둔다
    <ScrollView contentContainerStyle={{ paddingBottom: space }}>
      <View style={styles.container}>
        <ThemeSection
          themes={state.themes}
          themeId={state.themeId}
          showGallery={state.showThemeGallery}
          onSelect={actions.themeSelect}
          onGallery={actions.themeGalleryPress}
        />
        <GlassSection title="일반" style={styles.section}>
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
        </GlassSection>
        <GlassSection title="서비스" style={styles.section}>
          <Item
            title="활성화"
            subTitle="서비스 활성화 상태"
            option="active"
            value={state.active}
            onValueChange={actions.activeChange}
          />
        </GlassSection>
        <GlassSection title="위치정보" style={styles.section}>
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
        </GlassSection>
        <GlassSection title="약관 및 정책" style={styles.section}>
          {DOC_MENU.map((docType, i) => (
            <GlassRow
              key={docType}
              title={LEGAL_DOCS[docType].title}
              chevron
              divider={i < DOC_MENU.length - 1}
              onPress={() => actions.docPress(docType)}
            />
          ))}
        </GlassSection>
        <GlassSection title="버전" style={styles.section}>
          {/* 누르면 버전별 변경 내역 */}
          <GlassRow
            icon="code-branch"
            title="현재 버전"
            value={state.appVersion}
            chevron
            onPress={actions.versionPress}
          />
        </GlassSection>
        <GlassSection title="기타" style={styles.section}>
          <GlassRow
            icon="book-open"
            title="온보딩 화면 보기"
            chevron
            onPress={actions.onBoardingPress}
          />
        </GlassSection>
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
