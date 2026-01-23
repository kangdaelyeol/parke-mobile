import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { useCardOption } from '@/controllers';
import { convertPhone } from '@/helpers';

interface PressableBtnProps {
  style: StyleProp<TextStyle>;
  onPressedStyle: StyleProp<TextStyle>;
  text: string;
  onPressed: () => void;
}

const PressableBtn = ({
  style,
  onPressedStyle,
  text,
  onPressed,
}: PressableBtnProps) => {
  return (
    <Pressable style={[styles.pressable]} onPress={onPressed}>
      {({ pressed }) => (
        <Text
          suppressHighlighting
          selectable={false}
          style={[style, styles.text, pressed && onPressedStyle]}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
};

export default function CardOption({ card }: any) {
  const { user, handlers } = useCardOption();

  const {
    onEditPressed,
    onDeletePressed,
    onPreviewPressed,
    onAutoChangePressed,
    onChangePhonePressed,
  } = handlers;

  return (
    <View style={styles.optionContainer}>
      <View style={styles.optionWrapper}>
        <View style={styles.row}>
          <PressableBtn
            text="자동변경 on/off"
            style={styles.autoChangeText}
            onPressedStyle={styles.autoChangeTextPressed}
            onPressed={onAutoChangePressed}
          />
        </View>
        <View style={styles.row}>
          {convertPhone(user.phone) !== card.phone ? (
            <PressableBtn
              onPressed={onChangePhonePressed}
              text="내 번호로 변경"
              style={styles.changeText}
              onPressedStyle={styles.changeTextPressed}
            />
          ) : (
            <Text
              suppressHighlighting
              selectable={false}
              style={[styles.text, styles.changeTextDisabled]}
            >
              내 번호로 변경
            </Text>
          )}
          <PressableBtn
            onPressed={onPreviewPressed}
            text="미리보기"
            style={styles.previewText}
            onPressedStyle={styles.previewTextPressed}
          />
        </View>
        <View style={styles.row}>
          <PressableBtn
            onPressed={onEditPressed}
            text="수정"
            style={styles.editText}
            onPressedStyle={styles.editTextPressed}
          />
          <PressableBtn
            onPressed={onDeletePressed}
            text="삭제"
            style={styles.deleteText}
            onPressedStyle={styles.deleteTextPressed}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    position: 'absolute',
    width: '100%',
    top: 420,
    alignItems: 'center',
  },
  optionWrapper: {
    paddingHorizontal: 50,
    width: '100%',
    maxWidth: 480,
    gap: 15,
  },
  text: {
    color: '#e1e1e1',
    paddingVertical: 25,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 800,
    borderRadius: 10,
  },
  editText: {
    backgroundColor: '#007e92',
  },
  editTextPressed: {
    backgroundColor: '#0098af',
  },
  deleteText: {
    backgroundColor: '#a53737',
  },
  deleteTextPressed: {
    backgroundColor: '#bc3f3f',
  },
  changeText: {
    backgroundColor: '#292c64',
  },
  changeTextPressed: {
    backgroundColor: '#35397e',
  },
  previewText: {
    backgroundColor: '#3a2964',
  },
  previewTextPressed: {
    backgroundColor: '#4b3582',
  },
  autoChangeText: {
    backgroundColor: '#582964',
  },
  autoChangeTextPressed: {
    backgroundColor: '#773887',
  },
  changeTextDisabled: {
    backgroundColor: '#292c6455',
    color: '#acacac45',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  pressable: {
    flex: 1,
  },
});
