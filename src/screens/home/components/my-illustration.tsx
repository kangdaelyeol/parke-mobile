import { IllustrationSizeProps } from '@home/types'
import Svg, { Circle, Path } from 'react-native-svg'

export const MyIllustration = ({
  width = 120,
  height = 120,
}: IllustrationSizeProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      />
      <Circle
        stroke="#ffffff"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        cx={12}
        cy={7}
        r={4}
      />
    </Svg>
  )
}
