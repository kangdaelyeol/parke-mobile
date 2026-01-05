import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LogoText, LogoIcon } from '../assets/logo';
import {
  OnBoardingIcon1,
  OnBoardingIcon2,
  OnBoardingIcon1_1,
  OnBoardingIcon3,
} from '../assets/illustrations';
import { cache } from '../storage';

const Header1 = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <LogoIcon style={styles.logoIcon} width={70} height={70} />
        <LogoText style={styles.logoText} width={120} height={50} />
      </View>
    </View>
  );
};

const MainArticle1 = () => {
  const DEVICE_WIDTH = Dimensions.get('window').width;
  return (
    <View style={[{ width: DEVICE_WIDTH }]}>
      <OnBoardingIcon1_1
        style={main1Styles.onBoardingIllustrator1}
        width={350}
      />
      <View style={main1Styles.textContainer}>
        <Text style={main1Styles.title}>
          가족이 함께 쓰는 차량, 전화번호는?
        </Text>
        <Text style={main1Styles.subTitle}>
          운전자가 바뀔 때마다 주차번호판을 교체하는 불편함
        </Text>
      </View>
    </View>
  );
};
const main1Styles = StyleSheet.create({
  textContainer: {
    marginTop: 150,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: 'white',
    fontWeight: '700',
  },
  subTitle: {
    marginTop: 20,
    fontSize: 17,
    color: 'gray',
  },
  onBoardingIllustrator1: {
    marginTop: 130,
    marginHorizontal: 'auto',
  },
});

const MainArticle2 = () => {
  const DEVICE_WIDTH = Dimensions.get('window').width;
  return (
    <View style={[{ width: DEVICE_WIDTH }, mainArticle2Style.container]}>
      <OnBoardingIcon2
        width={DEVICE_WIDTH * 0.7}
        height={DEVICE_WIDTH * 0.7}
        style={mainArticle2Style.illustrator}
      />
      <Text style={mainArticle2Style.title}>
        QR 스캔시 운전자에 맞는{'\n'}번호 자동 전환
      </Text>

      <Text style={mainArticle2Style.subTitle}>
        BLE 기반으로 운전자를 자동 인식하여{'\n'}실시간으로 연락처를 변경합니다
      </Text>
    </View>
  );
};

const mainArticle2Style = StyleSheet.create({
  container: { alignItems: 'center' },
  illustrator: {
    marginTop: 50,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 40,
    marginTop: 40,
  },
  subTitle: {
    color: '#777777',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 25,
  },
});

const MainArticle3 = () => {
  const DEVICE_WIDTH = Dimensions.get('window').width;

  return (
    <View style={[{ width: DEVICE_WIDTH }, mainArticle3Style.container]}>
      <Text style={mainArticle3Style.title}>지금 시작하세요</Text>
      <Text style={mainArticle3Style.subTitle}>
        PARKE와 함께 스마트한 주차 경험을 시작하세요
      </Text>
      <OnBoardingIcon3
        width={DEVICE_WIDTH * 0.95}
        height={300}
        style={mainArticle3Style.illustrator}
      />
    </View>
  );
};

const mainArticle3Style = StyleSheet.create({
  container: { alignItems: 'center' },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 35,
  },
  subTitle: {
    color: '#666666',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 15,
    letterSpacing: -0.1,
  },
  illustrator: {
    marginTop: 70,
  },
});

const Footer = ({
  pageIdxStyleValue,
  pageIdx,
  setPageIdx,
  setHasSeenOnBoarding,
}: {
  pageIdxStyleValue: SharedValue<number>;
  pageIdx: number;
  setPageIdx: React.Dispatch<React.SetStateAction<number>>;
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const PAGE_COUNT = 3;

  const goToNextPage = () => {
    pageIdxStyleValue.value += 1;
    setPageIdx(prev => prev + 1);
  };

  const goToThisPage = (idx: number) => {
    pageIdxStyleValue.value = idx + 1;
    setPageIdx(idx + 1);
  };

  const goToMain = () => {
    setHasSeenOnBoarding(true);
    cache.setHasSeenOnBoarding(true);
  };

  return (
    <View style={footerStyles.container}>
      <View style={footerStyles.pageIndicator}>
        {Array.from({ length: PAGE_COUNT }, (_, idx) =>
          pageIdx === idx + 1 ? (
            <Text
              onPress={() => goToThisPage(idx)}
              key={idx}
              style={footerStyles.activeDot}
            />
          ) : (
            <Text
              onPress={() => goToThisPage(idx)}
              key={idx}
              style={footerStyles.inActiveDot}
            />
          ),
        )}
      </View>
      {pageIdx < PAGE_COUNT ? (
        <Text
          onPress={goToNextPage}
          style={[footerStyles.btn, footerStyles.nextBtn]}
        >
          다음
        </Text>
      ) : (
        <Text
          onPress={goToMain}
          style={[footerStyles.btn, footerStyles.startBtn]}
        >
          시작하기
        </Text>
      )}
    </View>
  );
};

const footerStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    height: 300,
    paddingBottom: 20,
    paddingHorizontal: 30,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: 'auto',
    marginBottom: 40,
  },
  btn: {
    width: '100%',
    fontSize: 18,
    paddingVertical: 28,
    fontWeight: 600,
    textAlign: 'center',
    marginHorizontal: 'auto',
    borderRadius: 20,
  },
  nextBtn: {
    backgroundColor: 'white',
  },
  startBtn: {
    backgroundColor: '#5cdeae',
    boxShadow: '0px 0px 20px #5cdeae',
    color: 'white',
  },
  activeDot: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    backgroundColor: '#a2f1cd',
    boxShadow: '0px 0px 10px 2px #a2f1cd',
  },
  inActiveDot: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    backgroundColor: '#555555',
  },
});

const Slider = ({
  pageIdxStyleValue,
}: {
  pageIdxStyleValue: SharedValue<number>;
}) => {
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(-(pageIdxStyleValue.value - 1) * DEVICE_WIDTH, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  Animated.FlatList;

  return (
    <View style={sliderStyle.container}>
      <Animated.View style={[sliderStyle.animationContainer, animatedStyle]}>
        <MainArticle1 />
        <MainArticle2 />
        <MainArticle3 />
      </Animated.View>
    </View>
  );
};

const sliderStyle = StyleSheet.create({
  animationContainer: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
});

export default function OnBoardingScreen({
  setHasSeenOnBoarding,
}: {
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pageIdxStyleValue = useSharedValue<number>(1);
  const [pageIdx, setPageIdx] = useState(1);

  return (
    <View style={styles.container}>
      <Header1 />
      <Slider pageIdxStyleValue={pageIdxStyleValue} />
      <Footer
        pageIdx={pageIdx}
        setPageIdx={setPageIdx}
        pageIdxStyleValue={pageIdxStyleValue}
        setHasSeenOnBoarding={setHasSeenOnBoarding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    height: '100%',
  },
  text: {
    color: 'white',
  },
  header: {
    height: 150,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
  },
  logoIcon: {
    marginTop: -10,
    marginLeft: -20,
  },
  logoText: {
    marginTop: 5,
  },
});
