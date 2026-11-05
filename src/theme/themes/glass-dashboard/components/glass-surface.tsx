import { View, ViewProps } from 'react-native'
import { glassStyles } from '../tokens'

interface GlassSurfaceProps extends ViewProps {
  // surface: 카드·목록 바탕 / inset: 판 안의 파인 영역 / tile: 판 안에 한 겹 더 놓인 타일
  variant?: 'surface' | 'inset' | 'tile'
}

// 유리 판 (영상의 glass-card)
export const GlassSurface = ({
  variant = 'surface',
  style,
  ...rest
}: GlassSurfaceProps) => (
  <View {...rest} style={[glassStyles[variant], style]} />
)
