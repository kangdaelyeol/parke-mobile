import { StyleSheet, View } from 'react-native';
import { FocusableInput, Loading, PressableButton } from '@/components';
import { useProfileMainViewModel } from '@/view-model';

export const Main = () => {
  const { state, actions } = useProfileMainViewModel();
  return (
    <View>
      <View style={styles.wrapper}>
        {state.loading && <Loading />}
        <View style={styles.inputSection}>
          <FocusableInput
            title="닉네임"
            placeholder="닉네임"
            onChangeText={actions.nicknameInput}
            value={state.nickname}
          />
          <FocusableInput
            title="연락처"
            placeholder="연락처"
            onChangeText={actions.phoneInput}
            value={state.phone}
          />
        </View>
        <View style={styles.buttonSection}>
          <PressableButton
            title="저장"
            onPress={actions.savePress}
            background={['#262e83', '#29457e']}
          />
          <PressableButton
            title="로그아웃"
            onPress={actions.logoutPress}
            background={['#2d2d2d', '#525252']}
          />
          <PressableButton
            title="회원탈퇴"
            onPress={actions.deletePress}
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
