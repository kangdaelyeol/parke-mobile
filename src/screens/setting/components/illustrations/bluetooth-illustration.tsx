import Svg, { Path } from 'react-native-svg'

export const BluetoothIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" width={21} height={21}>
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
