import { StyleSheet, Text, View } from 'react-native';
import { useOnBoardFooter } from '@/controllers/use-on-board-footer';
import { PAGE_COUNT } from '@/screens/on-boarding/constants';

const Footer = () => {
  const {
    pageIdx,
    pressed,
    onBtnPressedIn,
    onBtnPressedOut,
    goToMain,
    goToThisPage,
    goToNextPage,
  } = useOnBoardFooter();

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
          onPressIn={onBtnPressedIn}
          onPressOut={onBtnPressedOut}
          style={[styles.btn, styles.nextBtn, pressed && styles.pressedNextBtn]}
        >
          다음
        </Text>
      ) : (
        <Text
          suppressHighlighting
          selectable={false}
          onPress={goToMain}
          onPressIn={onBtnPressedIn}
          onPressOut={onBtnPressedOut}
          style={[
            styles.btn,
            styles.startBtn,
            pressed && styles.pressedStartBtn,
          ]}
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
  pressedNextBtn: {
    backgroundColor: '#d5d5d5',
  },
  startBtn: {
    backgroundColor: '#5cdeae',
    boxShadow: '0px 0px 20px #5cdeae',
    color: 'white',
  },
  pressedStartBtn: {
    backgroundColor: '#53c79c',
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
