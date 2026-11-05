import Svg, { Rect } from 'react-native-svg'
import { IllustrationSizeProps } from '@home/types'

export const QrIllustration = ({
  width,
  height,
  color = '#ffffff',
}: IllustrationSizeProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={7} height={7} stroke={color} strokeWidth={1.5} />
      <Rect
        x={14}
        y={3}
        width={7}
        height={7}
        stroke={color}
        strokeWidth={1.5}
      />
      <Rect
        x={3}
        y={14}
        width={7}
        height={7}
        stroke={color}
        strokeWidth={1.5}
      />
      <Rect
        x={13}
        y={13}
        width={2.5}
        height={2.5}
        stroke={color}
        fill={color}
      />
      <Rect
        x={19}
        y={13}
        width={2.5}
        height={2.5}
        stroke={color}
        fill={color}
      />
      <Rect
        x={13}
        y={19}
        width={2.5}
        height={2.5}
        stroke={color}
        fill={color}
      />
      <Rect
        x={19}
        y={19}
        width={2.5}
        height={2.5}
        stroke={color}
        fill={color}
      />
      <Rect
        x={16}
        y={16}
        width={2.5}
        height={2.5}
        stroke={color}
        fill={color}
      />
    </Svg>
  )
}
