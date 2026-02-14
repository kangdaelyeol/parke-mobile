import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCardOptionController } from '@/controllers';
import { Loading, PressableButton } from '@/components';
import { CardDto } from '@/domain/card';

interface CardOptionProps {
  card: CardDto;
}

export const CardOption = ({ card }: CardOptionProps) => {
  const { user, handlers, loading } = useCardOptionController();

  const {
    editPress,
    deletePress,
    previewPress,
    autoChangePress,
    changePhonePress,
  } = handlers;

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <PressableButton
            pressableStyle={styles.pressable}
            onPress={autoChangePress}
            title="자동변경 on/off"
            background={['#242431', '#303042']}
          />
        </View>
        <View style={styles.row}>
          {user.phone !== card.phone ? (
            <PressableButton
              onPress={changePhonePress}
              title="내 번호로 변경"
              background={['#242431', '#303042']}
              pressableStyle={styles.pressable}
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
          <PressableButton
            onPress={previewPress}
            title="미리보기"
            background={['#242431', '#303042']}
            pressableStyle={styles.pressable}
          />
        </View>
        <View style={styles.row}>
          <PressableButton
            onPress={editPress}
            title="수정"
            background={['#0098af', '#007e92']}
            pressableStyle={styles.pressable}
          />
          <PressableButton
            onPress={deletePress}
            title="삭제"
            background={['#a53737', '#bc3f3f']}
            pressableStyle={styles.pressable}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: 420,
    alignItems: 'center',
  },
  wrapper: {
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
    flexShrink: 1,
    flexBasis: 0,
  },
});
