import { StyleSheet, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSearchBleContext } from '@/contexts'
import { useSearchBleTitleViewModel } from '@/view-model'
import { title, subTitle } from '@search-ble/constants'
import { FONT } from '@/theme/fonts'
export const Title = () => {
  const {
    state: { detected },
  } = useSearchBleContext()
  const { animated, actions } = useSearchBleTitleViewModel()

  return (
    <>
      <Animated.View style={[styles.titleContainer, animated.titleStyle]}>
        <Text onLayout={actions.titleLayout} style={styles.title}>
          {detected ? title.DETECT : title.SEARCH}
        </Text>
      </Animated.View>
      <Animated.View style={animated.subTitleStyle}>
        <Text style={styles.subTitle}>
          {detected ? subTitle.DETECT : subTitle.SEARCH}
        </Text>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 37,
    fontFamily: FONT.MEDIUM,
    textAlign: 'center',
  },
  subTitle: {
    color: '#eee',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: FONT.REGULAR,
    marginTop: 15,
  },
})
