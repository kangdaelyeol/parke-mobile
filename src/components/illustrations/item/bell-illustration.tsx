import Svg, { Path } from 'react-native-svg'
import { ITEM_ICON_SIZE } from '@/components/illustrations/constants'

export const BellIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={ITEM_ICON_SIZE} height={ITEM_ICON_SIZE}>
      <Path
        stroke={'#34d399'}
        strokeWidth={2}
        fill={'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
      />
    </Svg>
  )
}
