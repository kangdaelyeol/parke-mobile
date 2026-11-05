import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CARD_LAYOUTS } from '@/domain/card'
import { HomeLayoutSelectorProps } from '@home/types'
import { DM_SANS } from '@/theme/fonts'
import { GLASS, glassText, TEXT } from '@/theme/glass'

// 웹 카드 화면 디자인 (a~d). 실제 모양은 카드의 [미리보기]로 확인한다
export const LayoutSelector = ({
  value,
  onChange,
}: HomeLayoutSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>화면 디자인</Text>
      <View style={styles.list}>
        {CARD_LAYOUTS.map(layout => (
          <Pressable
            key={layout}
            style={styles.pressable}
            onPress={() => onChange(layout)}
          >
            <View
              style={[styles.chip, layout === value && styles.chipSelected]}
            >
              <Text
                style={[
                  styles.letter,
                  layout === value && styles.letterSelected,
                ]}
              >
                {layout.toUpperCase()}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: glassText.label,
  list: {
    flexDirection: 'row',
    gap: 8,
  },
  pressable: {
    flex: 1,
  },
  chip: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: GLASS.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 고른 칸: 밝은 유리 + 뚜렷한 테두리
  chipSelected: {
    backgroundColor: GLASS.activeFill,
    borderColor: 'rgba(255,255,255,0.55)',
    borderTopColor: 'rgba(255,255,255,0.7)',
  },
  letter: {
    color: TEXT.tertiary,
    fontFamily: DM_SANS.BOLD,
    fontSize: 18,
  },
  letterSelected: {
    color: TEXT.primary,
  },
})
