import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { GLASS, Tone, TONE_COLORS, toneColors } from '../tokens'
import { SolidIconName } from './types'

interface IconTileProps {
  icon: SolidIconName
  tone?: Tone
  // tone 대신 임의의 색 (#RRGGBB, 카드 강조색 등)
  color?: string
  size?: number
  // tinted: 색을 옅게 깐 타일 (영상의 통계 카드 아이콘)
  // glass: 무채색 유리 타일에 아이콘만 색 (영상의 보안 로그 체크)
  variant?: 'tinted' | 'glass'
}

// 둥근 사각 아이콘 타일
export const IconTile = memo(
  ({
    icon,
    tone = 'neutral',
    color,
    size = 32,
    variant = 'tinted',
  }: IconTileProps) => {
    // 크기·색이 바뀔 때만 스타일을 새로 만든다
    const tileStyle = useMemo(() => {
      const c = color ? toneColors(color) : TONE_COLORS[tone]
      return {
        box: {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.3),
          ...(variant === 'tinted' && {
            backgroundColor: c.fill,
            borderColor: c.border,
          }),
        },
        color: c.color,
      }
    }, [color, tone, size, variant])
    return (
      <View
        style={[
          styles.tile,
          variant === 'glass' && styles.glass,
          tileStyle.box,
        ]}
      >
        <FontAwesome6
          name={icon}
          iconStyle="solid"
          size={Math.round(size * 0.42)}
          color={tileStyle.color}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  glass: {
    backgroundColor: GLASS.fill,
    borderColor: GLASS.border,
  },
})
