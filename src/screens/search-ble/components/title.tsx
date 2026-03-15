import { StyleSheet, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSearchBleContext } from '@/contexts'
import { useTitleViewModel } from '@/view-model/search-ble'
import { title, subTitle } from '@search-ble/constants'
import { DM_SANS } from '@/theme/fonts'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_LIGHT,
  WHITE,
} from '@/theme/color'
export const Title = () => {
  const {
    state: { detected },
  } = useSearchBleContext()
  const { animated, actions } = useTitleViewModel()

  return (
    <>
      <Animated.View
        style={[styles.scanContainer, animated.scanContainerStyle]}
      >
        <Animated.View style={[styles.dot, animated.dotStyle]} />
        <Text style={styles.scan}>스캔중</Text>
      </Animated.View>
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
  scanContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 100,
    marginTop: 20,
    marginHorizontal: 'auto',
    backgroundColor: DARK,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DARK_LIGHT,
  },
  scan: {
    color: GRAY_LIGHT,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 14,
  },
  dot: {
    backgroundColor: BLUE_PRIMARY,
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  titleContainer: {
    marginTop: 20,
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
