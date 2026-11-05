import { Pressable, StyleSheet, Text, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { GlassRow, GlassSection } from '@/components'
import { AppTheme, ThemeId } from '@/theme/themes'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GRAY, GRAY_DEEP } from '@/theme/color'
import { GLASS } from '@/theme/glass'
import { themed } from '@/theme/themed'
import { ThemeCard } from './theme-card'

interface ThemeSectionProps {
  themes: AppTheme[]
  themeId: ThemeId
  // [개발용] 구성 요소 보기 줄을 보일지
  showGallery: boolean
  onSelect: (id: ThemeId) => void
  onGallery: (id: ThemeId) => void
}

// 설정 → 테마: 테마 카드를 눌러 고르고, 구성 요소 화면이 있는 테마는 따로 볼 수 있다

// 기본 테마 모양 (처음 디자인의 설정 묶음)
const ClassicThemeSection = ({
  themes,
  themeId,
  showGallery,
  onSelect,
  onGallery,
}: ThemeSectionProps) => (
  <View style={classic.section}>
    <Text style={classic.title}>테마</Text>
    {themes.map(theme => (
      <ThemeCard
        key={theme.id}
        theme={theme}
        selected={theme.id === themeId}
        onPress={() => onSelect(theme.id)}
      />
    ))}
    {showGallery && (
      <View style={classic.lines}>
        {themes
          .filter(theme => theme.hasGallery)
          .map(theme => (
            <Pressable
              key={theme.id}
              onPress={() => onGallery(theme.id)}
              style={classic.line}
            >
              <Text style={classic.lineText}>{theme.name} 구성 요소 보기</Text>
              <FontAwesome6
                name="angle-right"
                size={14}
                iconStyle="solid"
                style={classic.angle}
              />
            </Pressable>
          ))}
      </View>
    )}
  </View>
)

// 글래스 모양: 제목도 판 안에, 테마 카드는 판 속 타일로
const GlassThemeSection = ({
  themes,
  themeId,
  showGallery,
  onSelect,
  onGallery,
}: ThemeSectionProps) => (
  <GlassSection title="테마" style={styles.section}>
    <View style={styles.cards}>
      {themes.map(theme => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          selected={theme.id === themeId}
          onPress={() => onSelect(theme.id)}
        />
      ))}
    </View>
    {showGallery &&
      themes
        .filter(theme => theme.hasGallery)
        .map(theme => (
          <GlassRow
            key={theme.id}
            style={styles.galleryRow}
            icon="swatchbook"
            tone="accent"
            title={`${theme.name} 구성 요소 보기`}
            subtitle="테마에 담긴 판·버튼·차트·표를 한 화면에서"
            chevron
            onPress={() => onGallery(theme.id)}
          />
        ))}
  </GlassSection>
)

export const ThemeSection = themed({
  classic: ClassicThemeSection,
  'glass-dashboard': GlassThemeSection,
})

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
  },
  cards: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
  },
  // 카드 아래 줄은 위에 가는 선으로 나눈다
  galleryRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GLASS.divider,
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  section: {
    marginTop: 40,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  lines: {
    marginTop: 17,
    gap: 10,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  lineText: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
  },
  angle: {
    color: GRAY_DEEP,
  },
})
