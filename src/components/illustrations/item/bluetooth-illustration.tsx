import Svg, { Path } from 'react-native-svg'
import { ITEM_ICON_SIZE } from '@/components/illustrations/constants'

export const BluetoothIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={ITEM_ICON_SIZE} height={ITEM_ICON_SIZE}>
      <Path
        stroke={'#92b3ff'}
        strokeWidth={2}
        fill={'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"
      />
    </Svg>
  )
}
