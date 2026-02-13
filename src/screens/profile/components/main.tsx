import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FocusableInput, Loading, PressableButton } from '@/components';
import { convertPhone } from '@/helpers';
import { MainProps } from '@profile/types';

export const Main = ({ viewModel }: MainProps) => {
  const { loading, nickname, handlers, phone } = viewModel;
  return (
    <View>
      <View style={styles.wrapper}>
        {loading && <Loading />}
        <View style={styles.inputSection}>
          <FocusableInput
            title="닉네임"
            placeholder="닉네임"
            onChangeText={handlers.nicknameInput}
            value={nickname}
          />
          <FocusableInput
            title="연락처"
            placeholder="연락처"
            onChangeText={handlers.phoneInput}
            value={convertPhone(phone)}
          />
        </View>
        <View style={styles.buttonSection}>
          <PressableButton
            title="저장"
            onPress={handlers.savePress}
            background={['#262e83', '#29457e']}
          />
          <PressableButton
            title="로그아웃"
            onPress={handlers.logoutPress}
            background={['#2d2d2d', '#525252']}
          />
          <PressableButton
            title="회원탈퇴"
            onPress={handlers.deletePress}
            background={['#9d2f2f', '#b23535']}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 360,
  },
  inputSection: {
    marginTop: 20,
    gap: 20,
  },
  buttonSection: {
    marginTop: 35,
    gap: 15,
  },
});
