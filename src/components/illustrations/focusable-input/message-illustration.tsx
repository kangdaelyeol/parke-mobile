import Svg, { Path } from 'react-native-svg'
import { FOCUSABLE_INPUT_ICON_SIZE } from '@/components/illustrations/constants'

export const MessageIllustration = () => {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={FOCUSABLE_INPUT_ICON_SIZE}
      height={FOCUSABLE_INPUT_ICON_SIZE}
    >
      <Path
        stroke={'#555'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        fill={'none'}
      />
    </Svg>
  )
}
