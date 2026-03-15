import { StyleSheet, Text, View } from 'react-native'
import { useFooterViewModel } from '@/view-model/on-boarding'
import { PAGE_COUNT } from '@on-boarding/constants'
import { PressableButton } from '@/components'
import { BLUE_PRIMARY, GRAY, WHITE } from '@/theme/color'

export const Footer = () => {
  const { state, actions } = useFooterViewModel()

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
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
        <View style={styles.buttonContainer}>
          {state.pageIdx < PAGE_COUNT ? (
            <PressableButton
              title="다음"
              onPress={actions.nextPress}
              background={[BLUE_PRIMARY, '#2530ff']}
              style={styles.btn}
              text={[WHITE, WHITE]}
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
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
    boxShadow: '0px 0px 5px #a2f1cd',
  },
  inActiveDot: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    backgroundColor: GRAY,
  },
  btn: {
    paddingVertical: 4,
  },
  startBtn: {
    boxShadow: '0px 0px 5px #5cdeae',
  },
  startBtnText: {
    color: WHITE,
  },
  buttonContainer: {
    marginBottom: 20,
  },
})
