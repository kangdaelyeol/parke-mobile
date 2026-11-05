import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { CARD_FRAME_PADDING, CARD_HEIGHT, CARD_WIDTH } from '@home/constants'
import { useEmptyCardViewModel } from '@home/view-model'
import { HomeEmptyCardProps } from '@home/types'
import { PRETENDARD } from '@/theme/fonts'
import { GLASS, glassStyles, TEXT } from '@/theme/glass'

// 슬라이더 맨 끝의 카드 추가 칸. 유리 카드와 같은 테두리 안에 점선 빈자리를 둔다
export const EmptyCard = ({ idx }: HomeEmptyCardProps) => {
  const { animated, actions } = useEmptyCardViewModel(idx)

  return (
    <Animated.View style={animated.cardStyle}>
      <Pressable
        onPressIn={() => ReactNativeHapticFeedback.trigger('selection')}
        onPress={actions.cardPress}
      >
        {({ pressed }) => (
          <View
            style={[
              glassStyles.surface,
              styles.frame,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.slot, pressed && styles.slotPressed]}>
              <View style={[styles.plus, pressed && styles.plusPressed]}>
                <FontAwesome6
                  name="plus"
                  iconStyle="solid"
                  size={20}
                  color={TEXT.primary}
                />
              </View>
              <Text style={styles.title}>카드 추가</Text>
              <Text style={styles.description}>기기를 찾아 등록해요</Text>
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  frame: {
    width: CARD_WIDTH,
    marginHorizontal: 'auto',
    padding: CARD_FRAME_PADDING,
    borderRadius: 28,
  },
  pressed: {
    backgroundColor: GLASS.fillActive,
    borderColor: GLASS.borderActive,
  },
  slot: {
    height: CARD_HEIGHT - (CARD_FRAME_PADDING + 1) * 2,
    borderRadius: 23,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPressed: {
    borderColor: 'rgba(255,255,255,0.28)',
  },
  plus: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPressed: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  title: {
    color: TEXT.strong,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  description: {
    marginTop: 4,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
})
