import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSearchBleContext } from '@/contexts';
import { useSearchBLETitleViewModel } from '@/view-model';
import { title, subTitle } from '@search-ble/constants';
export const Title = () => {
  const {
    state: { detected },
  } = useSearchBleContext();
  const { state, actions } = useSearchBLETitleViewModel();

  return (
    <>
      <Animated.View style={state.titleAnimatedStyle}>
        <Text onLayout={actions.titleLayout} style={styles.title}>
          {detected ? title.DETECT : title.SEARCH}
        </Text>
      </Animated.View>
      <Animated.View style={state.subTitleAnimatedStyle}>
        <Text style={styles.subTitle}>
          {detected ? subTitle.DETECT : subTitle.SEARCH}
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
