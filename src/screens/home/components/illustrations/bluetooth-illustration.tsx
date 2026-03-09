import Svg, { Polyline } from 'react-native-svg'

export const BluetoothIllustration = ({ size }: { size: number }) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Polyline
        points={'6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5'}
        stroke="#44ff88"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  )
}
