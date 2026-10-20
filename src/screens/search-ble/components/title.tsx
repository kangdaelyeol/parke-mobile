import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSearchBleContext } from '@search-ble/contexts'
import { SwapText } from '@search-ble/components/swap-text'
import { useTitleViewModel } from '@search-ble/view-model'
import { title, subTitle } from '@search-ble/constants'
import { DM_SANS } from '@/theme/fonts'
import { GRAY, WHITE } from '@/theme/color'

export const Title = () => {
  const {
    state: { detected },
  } = useSearchBleContext()
  const { animated, actions } = useTitleViewModel()

  return (
    <>
      <Animated.View style={[styles.titleContainer, animated.titleStyle]}>
        <SwapText
          text={detected ? title.DETECT : title.SEARCH}
          style={styles.title}
          onLayout={actions.titleLayout}
        />
      </Animated.View>
      <Animated.View style={animated.subTitleStyle}>
        <SwapText
          text={detected ? subTitle.DETECT : subTitle.SEARCH}
          style={styles.subTitle}
          delay={120}
        />
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 35,
  },
  title: {
    color: WHITE,
    fontSize: 30,
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
  },
  subTitle: {
    color: GRAY,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
})
