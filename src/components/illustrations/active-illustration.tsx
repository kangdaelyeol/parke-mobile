import Svg, { Path } from 'react-native-svg'

export const ActiveIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={21} height={21}>
      <Path
        stroke={'#F87171'}
        strokeWidth={2}
        fill={'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
      />
    </Svg>
  )
}
