import { cache } from '../../../storage';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { OnBoardContext } from '../../../contexts/on-board-context';

const Footer = ({
  setHasSeenOnBoarding,
}: {
  setHasSeenOnBoarding: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const PAGE_COUNT = 3;
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const { sliderTranslateX, setPageIdx, pageIdx } = useContext(OnBoardContext);

  const goToNextPage = () => {
    sliderTranslateX.value -= DEVICE_WIDTH;
    setPageIdx(prev => prev + 1);
  };

  const goToThisPage = (idx: number) => {
    sliderTranslateX.value = -DEVICE_WIDTH * idx;
    setPageIdx(idx + 1);
  };

  const goToMain = () => {
    setHasSeenOnBoarding(true);
    cache.setHasSeenOnBoarding(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageIndicator}>
        {Array.from({ length: PAGE_COUNT }, (_, idx) =>
          pageIdx === idx + 1 ? (
            <Text
              onPress={() => goToThisPage(idx)}
              key={idx}
              style={styles.activeDot}
            />
          ) : (
            <Text
              onPress={() => goToThisPage(idx)}
              key={idx}
              style={styles.inActiveDot}
            />
          ),
        )}
      </View>
      {pageIdx < PAGE_COUNT ? (
        <Text
          selectable={false}
          suppressHighlighting
          onPress={goToNextPage}
          style={[styles.btn, styles.nextBtn]}
        >
          다음
        </Text>
      ) : (
        <Text
          suppressHighlighting
          selectable={false}
          onPress={goToMain}
          style={[styles.btn, styles.startBtn]}
        >
          시작하기
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Footer;
