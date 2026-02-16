import { useEffect, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const SEARCHING_TITLE = '스캔을 시작할게요';
const DETECTED_TITLE = '장치를 찾았습니다';

const SEARCHING_SUBTITLE = '장치를 스캔중입니다';
const DETECTED_SUBTITLE = '장치를 디바이스에 더 가까이 인식시켜주세요';

export const Title = ({ detected }: { detected: boolean }) => {
  const [titleHeight, setTitleHeight] = useState(0);
  const titleTransY = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subTitleOpacity = useSharedValue(0);

  useEffect(() => {
    if (!titleHeight) return;

    const deviceHeight = Dimensions.get('window').height;
    titleTransY.value = deviceHeight / 2 - titleHeight * 3.5;
    titleTransY.value = withDelay(
      1500,
      withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      }),
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    subTitleOpacity.value = withDelay(2300, withTiming(1, { duration: 500 }));
  }, [titleHeight, titleOpacity, titleTransY, subTitleOpacity]);

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: 40,
      opacity: titleOpacity.value,
      transform: [
        {
          translateY: withTiming(titleTransY.value, {
            duration: 300,
            easing: Easing.bezier(0.33, 1, 0.68, 1),
          }),
        },
      ],
    };
  });

  const subTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subTitleOpacity.value,
    };
  });

  const ontitleLayout = (e: LayoutChangeEvent) => {
    setTitleHeight(e.nativeEvent.layout.height);
  };

  return (
    <>
      <Animated.View style={titleAnimatedStyle}>
        <Text onLayout={ontitleLayout} style={styles.title}>
          {detected ? DETECTED_TITLE : SEARCHING_TITLE}
        </Text>
      </Animated.View>
      <Animated.View style={subTitleAnimatedStyle}>
        <Text style={styles.subTitle}>
          {detected ? DETECTED_SUBTITLE : SEARCHING_SUBTITLE}
        </Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 37,
    fontWeight: 500,
    textAlign: 'center',
  },

  subTitle: {
    color: '#eee',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
  },
});
