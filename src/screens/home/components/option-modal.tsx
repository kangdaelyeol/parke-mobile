import { useCardOptionModalContext } from '@/contexts/card-option-modal-context';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { MODAL_HEIGHT } from '../constants';

export default function OptionModal() {
  const { gesturePan, animatedStyle } = useCardOptionModalContext();
  return (
    <GestureDetector gesture={gesturePan}>
      <Animated.View style={[styles.optionModal, animatedStyle]}>
        <View style={styles.optionModalWrapper}>
          <View
            style={{
              backgroundColor: '#e0e0e0',
              width: 60,
              marginHorizontal: 'auto',
              height: 4,
              borderRadius: 100,
              opacity: 0.8,
              marginTop: 8,
            }}
          ></View>
          <View style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <View style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  optionModal: {
    backgroundColor: '#1b1b1b',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
  },
  optionModalWrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  deleteText: {
    color: '#cf0707',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#0d0f11',
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 15,
  },
  editText: {
    color: '#2c4cdc',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editBtn: {
    backgroundColor: '#2b2b2b',
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 15,
  },
});
