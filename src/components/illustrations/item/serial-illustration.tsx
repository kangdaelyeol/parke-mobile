import Svg, { Path } from 'react-native-svg'
import { StyleSheet } from 'react-native'

export const SerialIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" style={styles.icon}>
      <Path
        d="M20 7V4h-3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M4 7V4h3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M4 17v3h3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M20 17v3h-3"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
      <Path
        d="M7 12h10"
        stroke={'#34d399'}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={'none'}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  icon: { width: '100%', height: '100%' },
})
