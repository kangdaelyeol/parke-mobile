import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useSearchBle } from '@/controllers';
import useHeptic from '@/hooks/use-heptic';
import { Header, Rader } from '@search-ble/components';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';

export default function SearchBLEScreen() {
  const { devices, rssi, scanState, setScanState } = useSearchBle();

  const { setTime, setHepticOption } = useHeptic();
  const [reset, setReset] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);

  if (scanState === 'NoneScaned' && rssi) {
    setScanState('Scaned');
    setTime(200);
    setHepticOption('impactMedium');
  }
  const titleTransY = useSharedValue(45);
  const titleOpacity = useSharedValue(0);
  const subTitleOpacity = useSharedValue(0);

  useEffect(() => {
    if (!titleHeight) return;

    const deviceHeight = Dimensions.get('window').height;
    console.log(titleHeight);
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
  }, [reset, titleHeight, titleOpacity, titleTransY, subTitleOpacity]);

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
    <View style={styles.container}>
      {/* test */}
      <Text
        onPress={() => {
          setReset(prev => prev + 1);
          titleTransY.value = 45;
        }}
        style={{
          color: 'white',
          position: 'absolute',
          top: 800,
          fontSize: 20,
          zIndex: 3,
        }}
      >
        Reset Animation
      </Text>
      <Text
        style={{
          position: 'absolute',
          top: 60,
          color: '#eeeeee',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        스캔된 Parke 와의 거리 {rssi}
      </Text>

      <ScrollView style={styles.list}>
        {devices.length === 0 ? (
          <Text style={styles.deviceText}>아직 스캔된 장치가 없습니다.</Text>
        ) : (
          devices.map(d => (
            <Text key={d.id} style={styles.deviceText}>
              • {d.name ?? '(이름 없음)'} ({d.id})
            </Text>
          ))
        )}
      </ScrollView>
      {/* test */}

      <Header />
      <Animated.View style={titleAnimatedStyle}>
        <Text onLayout={ontitleLayout} style={styles.title}>
          스캔을 시작할게요
        </Text>
      </Animated.View>
      <Animated.View style={subTitleAnimatedStyle}>
        <Text style={styles.subTitle}>장치를 스캔중입니다.</Text>
      </Animated.View>

      <Rader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 37,
    fontWeight: 500,
    textAlign: 'center',
  },

  list: {
    position: 'absolute',
    flex: 1,
    marginTop: 10,
    maxHeight: 300,
    bottom: 0,
  },
  subTitle: {
    color: '#eee',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
  },
  deviceText: { color: '#fff', fontSize: 16, marginVertical: 4, opacity: 0.2 },
});
