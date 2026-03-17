import { JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Item, ItemList } from '@/components'
import { useSearchBleContext } from '@/contexts'
import { BLUE_PRIMARY, GRAY_DEEP } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

const getProximity = (rssi: number): string => {
  if (rssi > -45) return '바로 옆'
  if (rssi > -60) return '가까움'
  if (rssi > -75) return '주변'
  return '멀리'
}

const Right = (rssi: string): (() => JSX.Element) => {
  const proximity = getProximity(Number(rssi))
  return () => <Text style={styles.proximity}>{proximity}</Text>
}

export const Footer = () => {
  const { state } = useSearchBleContext()
  return (
    <View style={styles.container}>
      {state.detected && (
        <View style={styles.detail}>
          <ItemList>
            <Item
              title="Parke"
              subTitle={`RSSI ${state.rssi} dBm`}
              option="bluetooth"
              Right={Right(state.rssi)}
            />
          </ItemList>
        </View>
      )}
      <Text style={styles.text}>
        장치에 가까이 다가가면 더 정확한 거리를 측정할 수 있어요
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  detail: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    marginBottom: 20,
  },
  text: {
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 40,
  },
  proximity: {
    color: BLUE_PRIMARY,
    fontFamily: DM_SANS.BOLD,
  },
})
