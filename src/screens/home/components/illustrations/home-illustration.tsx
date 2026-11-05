import Svg, { Path } from 'react-native-svg'
import { IllustrationSizeProps } from '@home/types'

export const HomeIllustration = ({
  width,
  height,
  color = '#ffffff',
}: IllustrationSizeProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      />
      <Path
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
      />
    </Svg>
  )
}
