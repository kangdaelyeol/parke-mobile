import { useEffect, useState } from 'react'
import { Dimensions, LayoutChangeEvent } from 'react-native'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { SearchBleTitleViewModel } from '@search-ble/types'

export const useTitleViewModel = (): SearchBleTitleViewModel => {
  const [titleHeight, setTitleHeight] = useState(0)
  const titleTransY = useSharedValue(0)
  const titleOpacity = useSharedValue(0)
  const subTitleOpacity = useSharedValue(0)
  const dotOpacity = useSharedValue(1)
  const scanContainerOpacity = useSharedValue(0)

  useEffect(() => {
    if (!titleHeight) return

    const deviceHeight = Dimensions.get('window').height
    titleTransY.value = deviceHeight / 2 - titleHeight * 5.3
    titleTransY.value = withDelay(
      1500,
      withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
    )
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }))
    subTitleOpacity.value = withDelay(2300, withTiming(1, { duration: 500 }))
    dotOpacity.value = withRepeat(
      withTiming(0.3, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
      -1,
      true,
    )
    scanContainerOpacity.value = withDelay(
      1500,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
    )
  }, [
    subTitleOpacity,
    titleHeight,
    titleOpacity,
    titleTransY,
    dotOpacity,
    scanContainerOpacity,
  ])

  const titleLayout = (e: LayoutChangeEvent) => {
    setTitleHeight(e.nativeEvent.layout.height)
  }

  const animated = {
    titleStyle: useAnimatedStyle(() => ({
      opacity: titleOpacity.value,
      transform: [
        {
          translateY: titleTransY.value,
        },
      ],
    })),
    subTitleStyle: useAnimatedStyle(() => ({
      opacity: subTitleOpacity.value,
    })),
    dotStyle: useAnimatedStyle(() => ({
      opacity: dotOpacity.value,
    })),
    scanContainerStyle: useAnimatedStyle(() => ({
      opacity: scanContainerOpacity.value,
    })),
  }

  return {
    state: {},
    animated,
    actions: {
      titleLayout,
    },
  }
}
