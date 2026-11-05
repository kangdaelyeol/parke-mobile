import { memo } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { Tone, TONE_COLORS } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { SolidIconName } from './types'

interface StatusPillProps {
  label: string
  tone?: Tone
  // 앞에 빛나는 점 (영상의 ● Live Feed)
  dot?: boolean
  // 앞에 작은 아이콘 (영상의 ↗ +14.6%)
  icon?: SolidIconName
  // soft: 색을 옅게 깐 바탕 + 같은 색 테두리 (영상 그대로)
  // plain: 바탕·테두리 없이 점/아이콘 + 글자만
  variant?: 'soft' | 'plain'
  style?: StyleProp<ViewStyle>
}

// 색 단계별 바탕·점·글자 스타일 (렌더할 때마다 새로 만들지 않는다)
const TONE_STYLES = Object.fromEntries(
  Object.entries(TONE_COLORS).map(([tone, c]) => [
    tone,
    {
      soft: { backgroundColor: c.fill, borderColor: c.border },
      dot: { backgroundColor: c.color, boxShadow: c.glow },
      text: { color: c.color },
    },
  ]),
) as Record<Tone, { soft: ViewStyle; dot: ViewStyle; text: TextStyle }>

// 상태 알약 (영상의 Verified · Optimal · Live Feed · +14.6%)
export const StatusPill = memo(
  ({
    label,
    tone = 'neutral',
    dot,
    icon,
    variant = 'soft',
    style,
  }: StatusPillProps) => {
    const t = TONE_STYLES[tone]
    return (
      <View
        style={[
          styles.pill,
          variant === 'soft' && [styles.soft, t.soft],
          style,
        ]}
      >
        {dot && <View style={[styles.dot, t.dot]} />}
        {icon && (
          <FontAwesome6
            name={icon}
            iconStyle="solid"
            size={9}
            color={TONE_COLORS[tone].color}
          />
        )}
        <Text style={[styles.text, t.text]} numberOfLines={2}>
          {label}
        </Text>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    minHeight: 22,
  },
  soft: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: PRETENDARD.BOLD,
    fontSize: 11,
  },
})
