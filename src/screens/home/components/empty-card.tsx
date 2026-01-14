import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const CARD_WIDTH = 250;
const CARD_HEIGHT = 140;

export default function EmptyCard() {
  const navigation = useNavigation<any>();

  return (
    <View style={emptyCardStyles.container}>
      <View style={emptyCardStyles.iconContainer}>
        <View style={emptyCardStyles.emptyCardIcon}>
          <FontAwesome6
            name="plus"
            iconStyle="solid"
            size={20}
            color={'gray'}
          />
        </View>
      </View>
      <Pressable onPress={() => navigation.replace('SearchBLE')}>
        {({ pressed }) => {
          pressed && ReactNativeHapticFeedback.trigger('selection');
          return (
            <View
              style={[emptyCardStyles.emptyCard, pressed && { opacity: 0.4 }]}
            ></View>
          );
        }}
      </Pressable>
    </View>
  );
}

const emptyCardStyles = StyleSheet.create({
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
});
