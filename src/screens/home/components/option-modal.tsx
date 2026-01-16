import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { MODAL_HEIGHT } from '../constants';
import { useCardSettingContext } from '@/contexts/card-setting-context';

export default function OptionModal() {
  const { gesturePan, animatedStyle } = useCardSettingContext();
  return (
    <GestureDetector gesture={gesturePan}>
      <Animated.View style={[styles.optionModal, animatedStyle]}>
        <View style={styles.optionModalWrapper}>
          <View style={styles.scrollBar} />
          <Pressable>
            {({ pressed }) => (
              <View style={[styles.editBtn, pressed && styles.editPressed]}>
                <Text style={styles.editText}>수정스</Text>
              </View>
            )}
          </Pressable>
          <Pressable>
            {({ pressed }) => (
              <View style={[styles.deleteBtn, pressed && styles.deletePressed]}>
                <Text style={styles.deleteText}>삭제스</Text>
              </View>
            )}
          </Pressable>
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
    borderRadius: 15,
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
    borderRadius: 15,
    marginTop: 20,
    paddingVertical: 15,
  },
  scrollBar: {
    backgroundColor: '#e0e0e0',
    width: 60,
    marginHorizontal: 'auto',
    height: 4,
    borderRadius: 100,
    opacity: 0.8,
    marginTop: 8,
  },
  editPressed: { backgroundColor: '#434343' },
  deletePressed: { backgroundColor: '#2d2d2d' },
});
