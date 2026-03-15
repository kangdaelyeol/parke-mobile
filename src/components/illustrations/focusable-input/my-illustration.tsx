import Svg, { Path } from 'react-native-svg'
import { FOCUSABLE_INPUT_ICON_SIZE } from '@/components/illustrations/constants'

export const MyIllustration = () => {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={FOCUSABLE_INPUT_ICON_SIZE}
      height={FOCUSABLE_INPUT_ICON_SIZE}
    >
      <Path
        fill="#555"
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
      />
    </Svg>
  )
}
