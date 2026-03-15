import Svg, { Path } from 'react-native-svg'
import { ITEM_ICON_SIZE } from '../constants'

export const SerialIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={ITEM_ICON_SIZE} height={ITEM_ICON_SIZE}>
      <Path
        d="M20 7V4h-3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M4 7V4h3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M4 17v3h3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M20 17v3h-3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M7 12h10"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
    </Svg>
  )
}
