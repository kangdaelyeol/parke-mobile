import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CARD_LAYOUTS } from '@/domain/card'
import { HomeLayoutSelectorProps } from '@home/types'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'

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
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  list: {
    flexDirection: 'row',
    gap: 8,
  },
  pressable: {
    flex: 1,
  },
  chip: {
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: WHITE,
  },
  letter: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 18,
  },
  letterSelected: {
    color: WHITE,
  },
})
