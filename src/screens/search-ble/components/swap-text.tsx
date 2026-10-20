import { LayoutChangeEvent, StyleProp, TextStyle } from 'react-native'
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated'

interface SwapTextProps {
  text: string
  style: StyleProp<TextStyle>
  // 새 문구가 나타나기 전 대기 (여러 줄을 차례로 바꿀 때)
  delay?: number
  onLayout?: (e: LayoutChangeEvent) => void
}

// 문구가 바뀌면 이전 문구는 위로 사라지고 새 문구가 아래에서 올라온다.
// 사라지는 문구는 레이아웃에서 빠진 채 겹쳐 그려지므로 높이가 튀지 않는다.
export const SwapText = ({
  text,
  style,
  delay = 0,
  onLayout,
}: SwapTextProps) => (
  <Animated.Text
    key={text}
    entering={FadeInDown.duration(450).delay(delay)}
    exiting={FadeOutUp.duration(250)}
    style={style}
    onLayout={onLayout}
  >
    {text}
  </Animated.Text>
)
