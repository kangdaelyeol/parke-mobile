import Svg, { Path } from 'react-native-svg'
import { StyleSheet } from 'react-native'

export const BluetoothIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" style={styles.icon}>
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

const styles = StyleSheet.create({
  icon: { width: '100%', height: '100%' },
})
