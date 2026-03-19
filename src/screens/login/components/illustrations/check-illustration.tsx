import Svg, { Path } from 'react-native-svg'

interface Props {
  size: number
}

export const CheckIllustration = ({ size }: Props) => {
  return (
    <Svg viewBox="0 0 12 12" width={size} height={size}>
      <Path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke={'#ffffff'}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
