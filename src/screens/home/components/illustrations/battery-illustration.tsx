import Svg, { Rect } from 'react-native-svg'

interface Props {
  level: number // 0-100
  width?: number
  height?: number
}

export const BatteryIllustration = ({
  level,
  width = 28,
  height = 14,
}: Props) => {
  const color = level > 50 ? '#4ADE80' : level > 20 ? '#FACC15' : '#F87171'

  const fillWidth = ((width - 6) * level) / 100 // 내부 채우기 너비

  return (
    <Svg
      width={width + 4}
      height={height}
      viewBox={`0 0 ${width + 4} ${height}`}
    >
      {/* 배터리 몸체 */}
      <Rect
        x={0}
        y={1}
        width={width}
        height={height - 2}
        rx={3}
        ry={3}
        stroke={color}
        strokeWidth={1.5}
        fill="transparent"
      />
      {/* 배터리 +극 */}
      <Rect
        x={width + 1}
        y={height / 2 - 3}
        width={3}
        height={6}
        rx={1}
        fill={color}
      />
      {/* 배터리 잔량 */}
      <Rect
        x={3}
        y={4}
        width={fillWidth}
        height={height - 8}
        rx={1.5}
        fill={color}
      />
    </Svg>
  )
}
