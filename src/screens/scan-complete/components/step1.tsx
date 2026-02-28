import { StyleSheet, Text, View } from 'react-native';
import { FocusableInput, PressableButton } from '@/components';
import { useScanCompleteContext } from '@/contexts/scan-complete-context';
import { FONT } from '@/theme/fonts';

export const Step1 = () => {
  const { state, actions } = useScanCompleteContext();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>기본정보를 입력해주세요!</Text>
      <FocusableInput
        title="Parke 이름"
        placeholder="Parke 이름"
        value={state.name}
        onChangeText={actions.nameInput}
      />
      <FocusableInput
        title="전화번호"
        placeholder="전화번호"
        value={state.phone}
        onChangeText={actions.phoneInput}
      />
      <FocusableInput
        title="메시지"
        placeholder="메시지"
        value={state.message}
        onChangeText={actions.messageInput}
      />
      <PressableButton
        pressableStyle={styles.btn}
        onPress={actions.nextPress}
        title="다음"
        background={['#222', '#444']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: '#eee',
    fontSize: 25,
    fontFamily: FONT.MEDIUM,
    textAlign: 'center',
    marginTop: 30,
  },
  btn: {
    marginTop: 10,
  },
});
