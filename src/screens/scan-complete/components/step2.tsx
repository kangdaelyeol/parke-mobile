import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { FocusableInput, PressableButton } from '@/components';
import { useScanCompleteContext } from '@/contexts/scan-complete-context';

type Step2Props = {
  deviceId: string;
};

export const Step2 = ({ deviceId }: Step2Props) => {
  const { actions, state } = useScanCompleteContext();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Parke의 QR코드를 스캔하거나{'\n'} 제품의 시리얼 번호를 입력해주세요!
        </Text>
        <View style={styles.select}>
          <Pressable onPress={actions.scanPress}>
            {({ pressed }) => (
              <View style={[styles.option, pressed && styles.optionPressed]}>
                <FontAwesome6
                  name="qrcode"
                  iconStyle="solid"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>QR코드 스캔하기</Text>
              </View>
            )}
          </Pressable>
          {state.serialInput ? (
            <FocusableInput
              title="시리얼 번호"
              value={state.serial}
              onChangeText={actions.serialInput}
              placeholder='시리얼 번호'
            />
          ) : (
            <Pressable onPress={actions.serialInputPress}>
              {({ pressed }) => (
                <View style={[styles.option, pressed && styles.optionPressed]}>
                  <FontAwesome6
                    name="hashtag"
                    iconStyle="solid"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionText}>시리얼 번호 입력하기</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <PressableButton
            onPress={() => actions.savePress(deviceId)}
            title="저장"
            background={['#304abb', '#3955cf']}
            pressableStyle={styles.button}
          />
          <PressableButton
            onPress={actions.prevPress}
            title="뒤로"
            background={['#3c3c3c', '#5a5a5a']}
            pressableStyle={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  title: {
    marginTop: 30,
    color: '#eeeeee',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 20,
    fontWeight: 700,
  },
  select: {
    marginTop: 20,
    gap: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  optionPressed: {
    backgroundColor: '#222',
  },
  optionText: {
    color: '#eee',
    fontWeight: 600,
    fontSize: 23,
    marginLeft: 15,
  },
  optionIcon: {
    fontSize: 40,
    color: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});
