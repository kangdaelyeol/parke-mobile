import Svg, { Rect } from 'react-native-svg'
import { ITEM_ICON_SIZE } from '../constants'

export const QrIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={ITEM_ICON_SIZE} height={ITEM_ICON_SIZE}>
      <Rect
        x={2}
        y={2}
        width={8}
        height={8}
        rx={1}
        stroke={'#3b3bf9'}
        strokeWidth={2}
        fill={'none'}
      />
      <Rect
        x={14}
        y={2}
        width={8}
        height={8}
        rx={1}
        stroke={'#3b3bf9'}
        strokeWidth={2}
        fill={'none'}
      />
      <Rect
        x={2}
        y={14}
        width={8}
        height={8}
        rx={1}
        stroke={'#3b3bf9'}
        strokeWidth={2}
        fill={'none'}
      />
    </Svg>
  )
}
