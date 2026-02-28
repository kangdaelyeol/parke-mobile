import { StyleSheet, Text, View } from 'react-native';
import { LogoIcon, LogoText } from '@/assets/logo';
import { FocusableInput, Loading, PressableButton } from '@/components';
import { useInitViewModel } from '@/view-model';
import { FONT } from '@/theme/fonts';

export default function InitScreen() {
  const { state, actions } = useInitViewModel();

  return (
    <View style={styles.container}>
      {state.loading && <Loading />}
      <View style={styles.wrapper}>
        <View style={styles.logoSection}>
          <LogoIcon width={40} height={40} />
          <LogoText width={80} height={40} />
        </View>
        <Text style={styles.title}>기본 정보를 입력해주세요!</Text>
        <View>
          <View style={styles.inputSection}>
            <FocusableInput
              title="닉네임"
              value={state.nickname}
              onChangeText={actions.nicknameInput}
              placeholder="닉네임"
            />
            <FocusableInput
              title="연락처"
              placeholder="연락처"
              value={state.phone}
              onChangeText={actions.phoneInput}
            />
          </View>
          <View style={styles.buttonSection}>
            <PressableButton
              title="저장"
              onPress={actions.savePress}
              background={['#182a4d', '#223a69']}
              pressableStyle={styles.pressable}
            />
            <PressableButton
              title="건너뛰기"
              onPress={actions.skipPress}
              background={['#161339', '#221d54']}
              pressableStyle={styles.pressable}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
  },
  logoSection: {
    marginHorizontal: 'auto',
    flexDirection: 'row',
    marginTop: 100,
    gap: 5,
  },
  title: {
    color: '#d3d3d3',
    marginTop: 25,
    fontSize: 28,
    fontFamily: FONT.MEDIUM,
    marginHorizontal: 'auto',
  },
  inputSection: {
    marginTop: 30,
    gap: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 35,
    gap: 35,
  },
  pressable: { flex: 1, flexShrink: 1, flexBasis: 0 },
});
