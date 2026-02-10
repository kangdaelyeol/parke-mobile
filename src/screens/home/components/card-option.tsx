import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { useCardOptionController } from '@/controllers';
import { Loading } from '@/components';
import { CardDto } from '@/domain/card';

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

interface CardOptionProps {
  card: CardDto;
}

export const CardOption = ({ card }: CardOptionProps) => {
  const { user, handlers, loading } = useCardOptionController();

  const {
    onEditPressed,
    onDeletePressed,
    onPreviewPressed,
    onAutoChangePressed,
    onChangePhonePressed,
  } = handlers;

  return (
    <View style={styles.optionContainer}>
      {loading && <Loading />}
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
          {user.phone !== card.phone ? (
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
};

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
    paddingVertical: 20,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 600,
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
    backgroundColor: '#242431',
  },
  changeTextPressed: {
    backgroundColor: '#303042',
  },
  previewText: {
    backgroundColor: '#242431',
  },
  previewTextPressed: {
    backgroundColor: '#303042',
  },
  autoChangeText: {
    backgroundColor: '#242431',
  },
  autoChangeTextPressed: {
    backgroundColor: '#303042',
  },
  changeTextDisabled: {
    backgroundColor: '#242431',
    color: '#cdcdcd4f',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  pressable: {
    flex: 1,
  },
});
