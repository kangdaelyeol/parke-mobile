import { StyleSheet } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'

export const LocationIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" style={styles.icon}>
      <Path
        d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
        stroke={'#ffb84d'}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={'none'}
        strokeWidth={2}
      />
      <Circle
        fill={'none'}
        cx={12}
        cy={10}
        r={2.6}
        strokeWidth={2}
        stroke={'#ffb84d'}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  icon: { width: '100%', height: '100%' },
})
