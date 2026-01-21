import { useUserContext } from '@/contexts/user-context';
import { convertPhone } from '@/helpers';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CardOption({ card }: any) {
  const user = useUserContext();
  console.log(card.phone, user.phone);
  return (
    <View style={styles.optionContainer}>
      <View style={styles.optionWrapper}>
        <View style={styles.row}>
          <Text style={[styles.text, styles.autoChangeText]}>
            자동변경 on/off
          </Text>
        </View>
        <View style={styles.row}>
          {convertPhone(user.phone) !== card.phone ? (
            <Text style={[styles.text, styles.changeText]}>내 번호로 변경</Text>
          ) : (
            <Text style={[styles.text, styles.changeTextDisabled]}>
              내 번호로 변경
            </Text>
          )}

          <Text style={[styles.text, styles.previewText]}>미리보기</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.text, styles.editText]}>수정</Text>
          <Text style={[styles.text, styles.deleteText]}>삭제</Text>
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
  deleteText: {
    backgroundColor: '#a53737',
  },
  changeText: {
    backgroundColor: '#292c64',
  },
  previewText: {
    backgroundColor: '#3a2964',
  },
  autoChangeText: {
    backgroundColor: '#582964',
  },
  changeTextDisabled: {
    backgroundColor: '#292c6455',
    color: '#acacac45',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
});
