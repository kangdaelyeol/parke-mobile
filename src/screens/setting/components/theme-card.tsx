import { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { StatusPill } from '@/components'
import { AppTheme } from '@/theme/themes'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { glassStyles, glassText, TEXT, withAlpha } from '@/theme/glass'
import { themed } from '@/theme/themed'

interface ThemeCardProps {
  theme: AppTheme
  selected: boolean
  onPress: () => void
}

// 테마 카드: 그 테마의 미리보기 + 이름/설명. 카드 틀은 지금 쓰는 테마의 모양을 따른다

// 기본 테마 틀: 어두운 카드, 고른 카드는 그 테마 강조색 테두리 (처음 디자인)
const ClassicThemeCard = memo(
  ({ theme, selected, onPress }: ThemeCardProps) => (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            classic.card,
            selected && { borderColor: theme.accent },
            pressed && classic.pressed,
          ]}
        >
          <theme.Preview />
          <View style={classic.info}>
            <View style={classic.titleRow}>
              <Text style={classic.name}>{theme.name}</Text>
              <Text
                style={[classic.state, selected && { color: theme.accent }]}
              >
                {selected ? '사용 중' : '고르기'}
              </Text>
            </View>
            <Text style={classic.description}>{theme.description}</Text>
          </View>
        </View>
      )}
    </Pressable>
  ),
)

// 글래스 틀: 테마 묶음 판 속 타일, 고른 카드는 그 테마 강조색 테두리 + 사용 중 알약
const GlassThemeCard = memo(({ theme, selected, onPress }: ThemeCardProps) => (
  <Pressable onPress={onPress}>
    {({ pressed }) => (
      <View
        style={[
          glassStyles.tile,
          styles.card,
          selected && {
            borderColor: withAlpha(theme.accent, 0.55),
            borderTopColor: withAlpha(theme.accent, 0.8),
          },
          pressed && styles.pressed,
        ]}
      >
        <theme.Preview />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={glassText.title}>{theme.name}</Text>
            {selected ? (
              <StatusPill dot tone="success" label="사용 중" />
            ) : (
              <Text style={styles.choose}>고르기</Text>
            )}
          </View>
          <Text style={glassText.subtitle}>{theme.description}</Text>
        </View>
      </View>
    )}
  </Pressable>
))

export const ThemeCard = themed({
  classic: ClassicThemeCard,
  'glass-dashboard': GlassThemeCard,
})

const styles = StyleSheet.create({
  // 테마 묶음 판 안에 놓이는 타일
  card: {
    padding: 10,
    gap: 12,
    borderRadius: 14,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  info: {
    paddingHorizontal: 6,
    paddingBottom: 4,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  choose: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  card: {
    marginTop: 15,
    padding: 10,
    gap: 12,
    backgroundColor: DARK,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  pressed: {
    borderColor: GRAY,
  },
  info: {
    paddingHorizontal: 6,
    paddingBottom: 4,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  state: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 12,
  },
  description: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
})
