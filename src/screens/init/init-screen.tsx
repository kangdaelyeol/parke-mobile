import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LogoIcon, LogoText } from '@/assets/logo';
import { FocusableInput, Loading } from '@/components';
import { useInitViewModel } from '@/view-model';

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
            <Pressable onPress={actions.savePress} style={styles.pressable}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.button,
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                  ]}
                >
                  <Text style={styles.buttonText}>저장</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={actions.skipPress} style={styles.pressable}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.button,
                    styles.laterButton,
                    pressed && styles.laterButtonPressed,
                  ]}
                >
                  <Text style={styles.buttonText}>건너뛰기</Text>
                </View>
              )}
            </Pressable>
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
    fontWeight: 'bold',
    marginHorizontal: 'auto',
  },
  inputSection: {
    marginTop: 30,
    gap: 20,
  },
  inputContainer: {
    gap: 10,
  },
  inputTitle: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nicknameTitleFocused: {
    color: '#eeeeee',
  },
  nicknameInputFocused: {
    borderColor: '#eeeeee',
  },
  phoneTitleFocused: {
    color: '#eeeeee',
  },
  phoneInputFocused: {
    borderColor: '#eeeeee',
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#606060',
    paddingHorizontal: 7,
    fontSize: 17,
    height: 50,
    color: '#dddddd',
    fontWeight: '500',
    maxWidth: 400,
  },
  buttonSection: {
    flexDirection: 'row',
    marginTop: 35,
    gap: 35,
  },
  button: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#182a4d',
  },
  saveButtonPressed: {
    backgroundColor: '#223a69',
  },
  laterButton: {
    backgroundColor: '#161339',
  },
  laterButtonPressed: {
    backgroundColor: '#221d54',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#d3d3d3',
  },
  pressable: { flex: 1 },
});
