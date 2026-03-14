import Svg, { Circle, Path } from 'react-native-svg'

export const CameraIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={21} height={21}>
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={'#6e70ff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={'none'}
        strokeWidth={2}
      />
      <Circle
        fill={'none'}
        cx={12}
        cy={13}
        r={4}
        strokeWidth={2}
        stroke={'#6e70ff'}
      />
    </Svg>
  )
}
