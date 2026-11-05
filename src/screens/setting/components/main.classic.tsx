import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useMainViewModel } from '@setting/view-model'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP } from '@/theme/color'
import { Item, ItemDivider, ItemList } from '@/components'
import { LEGAL_DOCS } from '@/constants'
import { DocType } from '@/types/common'
import { useTabBarLayout } from '@/hooks'
import { ThemeSection } from './theme-section'

// 설정 화면에 보여줄 법률 문서 순서
const DOC_MENU: DocType[] = [
  'privacy',
  'terms',
  'location',
  'consent',
  'location-consent',
  'consent-third',
]

// 설정 본문 (기본 테마: 처음 디자인)
export const ClassicMain = () => {
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
        <View style={styles.section}>
          <Text style={styles.title}>일반</Text>
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
          <Text style={styles.title}>서비스</Text>
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
          <Text style={styles.title}>위치정보</Text>
          <View style={styles.termSection}>
            <View style={styles.termLine}>
              <Text style={styles.termText}>주행 모드 위치정보 동의</Text>
              <Text style={styles.statusText}>
                {state.locationAgreed ? '동의함' : '동의하지 않음'}
              </Text>
            </View>
            <Pressable
              onPress={actions.consentSettingPress}
              style={styles.termLine}
            >
              {/* 법률 문서의 철회 안내("앱 설정 → 위치정보 동의 철회")와 같은 이름을 쓴다 */}
              <Text style={styles.termText}>위치정보 동의 철회</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>약관 및 정책</Text>
          <View style={styles.termSection}>
            {DOC_MENU.map(docType => (
              <Pressable
                key={docType}
                onPress={() => actions.docPress(docType)}
                style={styles.termLine}
              >
                <Text style={styles.termText}>{LEGAL_DOCS[docType].title}</Text>
                <FontAwesome6
                  name="angle-right"
                  size={14}
                  iconStyle="solid"
                  style={styles.angle}
                />
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>버전</Text>
          <View style={styles.termSection}>
            {/* 누르면 버전별 변경 내역 */}
            <Pressable onPress={actions.versionPress} style={styles.termLine}>
              <Text style={styles.termText}>{state.appVersion}</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={styles.angle}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>기타</Text>
          <View style={styles.termSection}>
            <View style={styles.termLine}>
              <Pressable onPress={actions.onBoardingPress}>
                <Text style={styles.termText}>온보딩 화면 보기</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
    paddingBottom: 80,
    marginHorizontal: 'auto',
  },
  section: {
    marginTop: 40,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  list: {
    justifyContent: 'center',
    backgroundColor: DARK,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  divider: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: DARK_LIGHT,
    height: 1.5,
  },
  termSection: {
    marginTop: 17,
    gap: 10,
  },
  termLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  statusText: {
    color: '#888',
    fontSize: 14,
  },
  termText: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
  },
  angle: {
    color: GRAY_DEEP,
  },
})
