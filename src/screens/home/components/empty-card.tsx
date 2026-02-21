import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { CARD_HEIGHT, CARD_WIDTH } from '@home/constants';
import { useHomeEmptyCardViewModel } from '@/view-model';
import { EmptyCardProps } from '@home/types';

export const EmptyCard = ({ idx }: EmptyCardProps) => {
  const { state, actions } = useHomeEmptyCardViewModel(idx);

  return (
    <Animated.View style={[styles.container, state.animatedStyle]}>
      <View style={styles.iconContainer}>
        <View style={styles.emptyCardIcon}>
          <FontAwesome6
            name="plus"
            iconStyle="solid"
            size={20}
            color={'gray'}
          />
        </View>
      </View>
      <Pressable onPress={actions.cardPress}>
        {({ pressed }) => {
          pressed && ReactNativeHapticFeedback.trigger('selection');
          return (
            <View style={[styles.emptyCard, pressed && styles.cardPressed]} />
          );
        }}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 'auto',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  emptyCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: 'gray',
    opacity: 0.2,
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCardIcon: {
    width: 30,
    height: 30,
    opacity: 0.6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    margin: 'auto',
  },
  cardPressed: { opacity: 0.4 },
});
