import { memo, useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AreaChart, StatusPill } from '@/components'
import { AppTheme } from '@/theme/themes'
import { PRETENDARD } from '@/theme/fonts'
import { glassStyles, glassText, TEXT, withAlpha } from '@/theme/glass'

interface ThemeCardProps {
  theme: AppTheme
  selected: boolean
  onPress: () => void
}

// 미리보기 영역 차트 값 (오른쪽 위로 오르는 모양)
const PREVIEW_DATA = [3, 4.2, 3.6, 5.1, 4.7, 6.2, 5.6, 7.4]

// 테마 카드: 그 테마의 판·숫자·알약·차트·강조 버튼을 작게 담은 미리보기 + 이름/설명
export const ThemeCard = memo(
  ({ theme, selected, onPress }: ThemeCardProps) => {
    const { tokens, preview } = theme
    // 차트는 값이 바뀔 때만 경로를 다시 그리므로 같은 배열을 넘긴다
    const series = useMemo(
      () => [{ data: PREVIEW_DATA, color: tokens.chart.primary }],
      [tokens.chart.primary],
    )

    return (
      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={[
              glassStyles.surface,
              styles.card,
              selected && {
                borderColor: withAlpha(preview.accent, 0.55),
                borderTopColor: withAlpha(preview.accent, 0.8),
              },
              pressed && styles.pressed,
            ]}
          >
            <View style={[glassStyles.inset, styles.preview]}>
              <View style={[glassStyles.surface, styles.miniPanel]}>
                <Text style={styles.miniLabel}>BLE 감지</Text>
                <Text style={styles.miniValue}>128</Text>
                <StatusPill tone="success" icon="arrow-trend-up" label="12%" />
              </View>
              <View
                style={[glassStyles.surface, styles.miniPanel, styles.grow]}
              >
                <View style={styles.toneRow}>
                  {preview.tones.map(color => (
                    <View
                      key={color}
                      style={[styles.toneDot, { backgroundColor: color }]}
                    />
                  ))}
                </View>
                <AreaChart series={series} height={34} dots={false} />
                <View
                  style={[
                    styles.miniButton,
                    {
                      experimental_backgroundImage: tokens.accent.fill,
                      boxShadow: tokens.accent.glow,
                    },
                  ]}
                >
                  <Text style={styles.miniButtonText}>주행모드</Text>
                </View>
              </View>
            </View>
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
    )
  },
)

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    padding: 10,
    gap: 12,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  preview: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 14,
  },
  miniPanel: {
    padding: 10,
    gap: 5,
    borderRadius: 12,
  },
  grow: {
    flex: 1,
    justifyContent: 'space-between',
  },
  miniLabel: {
    color: TEXT.secondary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 10.5,
  },
  miniValue: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  toneRow: {
    flexDirection: 'row',
    gap: 5,
  },
  toneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  miniButton: {
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderTopColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniButtonText: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 11,
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
