import Svg, { Rect } from 'react-native-svg'
import { StyleSheet } from 'react-native'

export const QrIllustration = () => {
  return (
    <Svg viewBox="0 0 24 24" style={styles.icon}>
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

const styles = StyleSheet.create({
  icon: { width: '100%', height: '100%' },
})
