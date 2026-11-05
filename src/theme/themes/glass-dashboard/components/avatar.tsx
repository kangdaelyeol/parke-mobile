import { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ACCENT_TILE } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

interface AvatarProps {
  name: string
  size?: number
  // 바탕색 (#RRGGBB). 없으면 강조색 그라데이션
  color?: string
}

// 영문은 단어 첫 글자 두 개(Alex Rivera → AR), 한글은 첫 글자
const initials = (name: string) => {
  const [first, second] = name.trim().split(/\s+/).filter(Boolean)
  if (!first) return '?'
  if (/^[A-Za-z]/.test(first))
    return (first.charAt(0) + (second?.charAt(0) ?? '')).toUpperCase()
  return first.charAt(0)
}

// 이름 첫 글자를 얹은 둥근 사각 타일 (영상의 CX, AR)
export const Avatar = memo(({ name, size = 40, color }: AvatarProps) => (
  <View
    style={[
      styles.tile,
      { width: size, height: size, borderRadius: Math.round(size * 0.3) },
      color ? { backgroundColor: color } : styles.accent,
    ]}
  >
    <Text style={[styles.text, { fontSize: Math.round(size * 0.36) }]}>
      {initials(name)}
    </Text>
  </View>
))

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  accent: {
    experimental_backgroundImage: ACCENT_TILE,
  },
  text: {
    color: '#ffffff',
    fontFamily: PRETENDARD.BOLD,
  },
})
