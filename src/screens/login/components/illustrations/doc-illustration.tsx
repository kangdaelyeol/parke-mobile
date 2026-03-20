import { GRAY } from '@/theme/color'
import Svg, { Path } from 'react-native-svg'

interface Props {
  size: number
}

export const DocIllustration = ({ size }: Props) => {
  return (
    <Svg viewBox="0 0 16 16" width={size} height={size}>
      <Path
        d="M4 2h5l3 3v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"
        stroke={GRAY}
        fill={'none'}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 8h5M5.5 10.5h3"
        stroke={GRAY}
        fill={'none'}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
