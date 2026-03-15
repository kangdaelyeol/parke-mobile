import Svg, { Path, Rect } from 'react-native-svg'
import { FOCUSABLE_INPUT_ICON_SIZE } from '@/components/illustrations/constants'

export const CardIllustration = () => {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={FOCUSABLE_INPUT_ICON_SIZE}
      height={FOCUSABLE_INPUT_ICON_SIZE}
    >
      <Rect
        x={2}
        y={3}
        width={20}
        height={18}
        rx={3}
        stroke={'#555'}
        strokeWidth={2}
        fill={'none'}
      />
      <Path d="M8 7h8M8 12h5" stroke={'#555'} strokeWidth={2} />
    </Svg>
  )
}
