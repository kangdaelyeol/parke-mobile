import { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ACCENT_GLOW, ACCENT_TILE, TEXT } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

interface BrandBlockProps {
  title: string
  // 제목 아래 작은 글자 (영상의 ADMIN CENTER)
  caption?: string
  // 강조색 타일 안에 얹을 로고
  logo: ReactNode
  size?: number
}

// 브랜드 묶음: 강조색 로고 타일 + 이름 + 작은 설명 (영상 사이드바 맨 위)
export const BrandBlock = ({
  title,
  caption,
  logo,
  size = 38,
}: BrandBlockProps) => (
  <View style={styles.row}>
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: Math.round(size * 0.28) },
      ]}
    >
      {logo}
    </View>
    <View style={styles.texts}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {!!caption && (
        <Text style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
      )}
    </View>
  </View>
)

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderTopColor: 'rgba(255,255,255,0.3)',
    experimental_backgroundImage: ACCENT_TILE,
    boxShadow: ACCENT_GLOW,
  },
  texts: {
    gap: 2,
  },
  title: {
    color: TEXT.primary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 16,
  },
  caption: {
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 10.5,
    letterSpacing: 1.2,
  },
})
