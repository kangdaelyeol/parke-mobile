import Svg, { Rect, Path, Circle } from 'react-native-svg'
import { IllustrationSizeProps } from '@home/types'

export const CarIllustration = ({
  width = 120,
  height = 120,
}: IllustrationSizeProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      {/* Car silhouette */}
      <Rect
        x={20}
        y={55}
        width={80}
        height={32}
        rx={6}
        fill="#1e1e1e"
        stroke="#333"
        strokeWidth={1.5}
      />
      <Path
        d="M35 55 L45 38 L75 38 L85 55Z"
        fill="#1e1e1e"
        stroke="#333"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Windows */}
      <Rect
        x={47}
        y={42}
        width={12}
        height={11}
        rx={2}
        fill="#2a2a2a"
        stroke="#3a3a3a"
        strokeWidth={1}
      />
      <Rect
        x={61}
        y={42}
        width={12}
        height={11}
        rx={2}
        fill="#2a2a2a"
        stroke="#3a3a3a"
        strokeWidth={1}
      />
      {/* Wheels */}
      <Circle
        cx={42}
        cy={87}
        r={10}
        fill="#111"
        stroke="#333"
        strokeWidth={1.5}
      />
      <Circle
        cx={42}
        cy={87}
        r={5}
        fill="#1e1e1e"
        stroke="#3a3a3a"
        strokeWidth={1}
      />
      <Circle
        cx={78}
        cy={87}
        r={10}
        fill="#111"
        stroke="#333"
        strokeWidth={1.5}
      />
      <Circle
        cx={78}
        cy={87}
        r={5}
        fill="#1e1e1e"
        stroke="#3a3a3a"
        strokeWidth={1}
      />
      {/* BLE signal waves */}
      <Path
        d="M95 35 Q103 42 95 49"
        stroke="#e8f060"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.3}
      />
      <Path
        d="M99 31 Q110 42 99 53"
        stroke="#e8f060"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.2}
      />
      {/* BLE dot */}
      <Circle cx={92} cy={42} r={3} fill="#e8f060" opacity={0.6} />
    </Svg>
  )
}
