import { memo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { GLASS, glassStyles, TEXT, Tone, TONE_COLORS } from '../tokens'
import { SolidIconName } from './types'

interface GlassIconButtonProps {
  icon: SolidIconName
  onPress: () => void
  size?: number
  // 원형 (기본은 둥근 사각)
  round?: boolean
  // 오른쪽 위 작은 상태 점 (영상의 알림 종 초록 점)
  dot?: Tone
  color?: string
}

// 아이콘만 있는 유리 버튼 (영상 상단 바의 알림 종)
export const GlassIconButton = memo(
  ({
    icon,
    onPress,
    size = 38,
    round,
    dot,
    color = TEXT.strong,
  }: GlassIconButtonProps) => (
    <Pressable onPress={onPress} hitSlop={6}>
      {({ pressed }) => (
        <View
          style={[
            glassStyles.surface,
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: round ? size / 2 : Math.round(size * 0.3),
            },
            pressed && styles.pressed,
          ]}
        >
          <FontAwesome6
            name={icon}
            iconStyle="solid"
            size={Math.round(size * 0.4)}
            color={color}
          />
          {dot && (
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: TONE_COLORS[dot].color,
                  boxShadow: TONE_COLORS[dot].glow,
                },
              ]}
            />
          )}
        </View>
      )}
    </Pressable>
  ),
)

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: GLASS.fillActive,
    borderColor: GLASS.borderActive,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
})
