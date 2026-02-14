import { StyleSheet, Text, View } from 'react-native';
import { useOnBoardingFooterViewModel } from '@/view-model';
import { PAGE_COUNT } from '@on-boarding/constants';
import { PressableButton } from '@/components';

export const Footer = () => {
  const { state, actions } = useOnBoardingFooterViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.pageIndicator}>
        {Array.from({ length: PAGE_COUNT }, (_, idx) =>
          state.pageIdx === idx + 1 ? (
            <Text
              onPress={() => actions.dotPress(idx)}
              key={idx}
              style={styles.activeDot}
            />
          ) : (
            <Text
              onPress={() => actions.dotPress(idx)}
              key={idx}
              style={styles.inActiveDot}
            />
          ),
        )}
      </View>
      {state.pageIdx < PAGE_COUNT ? (
        <PressableButton
          title="다음"
          onPress={actions.nextPress}
          background={['#ffffff', '#d5d5d5']}
          textStyle={styles.nextBtnText}
          style={styles.btn}
        />
      ) : (
        <PressableButton
          title="시작하기"
          onPress={actions.startPress}
          background={['#53c79c', '#5cdeae']}
          textStyle={styles.startBtnText}
          style={[styles.startBtn, styles.btn]}
        />
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
  btn: {
    marginBottom: 10,
    paddingVertical: 4,
  },
  nextBtnText: {
    color: 'black',
  },
  startBtn: {
    marginBottom: 10,
    boxShadow: '0px 0px 20px #5cdeae',
  },
  startBtnText: {
    color: 'white',
  },
});
