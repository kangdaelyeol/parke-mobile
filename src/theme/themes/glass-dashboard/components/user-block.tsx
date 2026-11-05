import { memo } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'
import { Avatar } from './avatar'

interface UserBlockProps {
  name: string
  // 이름 아래 작은 글자 (역할·이메일·아이디)
  caption?: string
  // 아바타 바탕색. 없으면 강조색 그라데이션
  color?: string
  size?: number
  style?: StyleProp<ViewStyle>
}

// 아바타 + 이름 + 설명 (영상 사이드바 아래 프로필, 표의 사용자 칸)
export const UserBlock = memo(
  ({ name, caption, color, size = 36, style }: UserBlockProps) => (
    <View style={[styles.row, style]}>
      <Avatar name={name} color={color} size={size} />
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {!!caption && (
          <Text style={styles.caption} numberOfLines={1}>
            {caption}
          </Text>
        )}
      </View>
    </View>
  ),
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  texts: {
    flexShrink: 1,
    gap: 2,
  },
  name: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 14,
  },
  caption: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 11.5,
  },
})
