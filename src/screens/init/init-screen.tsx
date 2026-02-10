import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LogoIcon, LogoText } from '@/assets/logo';
import { useInitController } from '@/controllers';
import { convertPhone } from '@/helpers';
import { Loading } from '@/components';
import { InitStactNavigationProp } from '@/navigation/types';

export default function InitScreen({
  navigation,
}: {
  navigation: InitStactNavigationProp;
}) {
  const { handlers, nicknameFocus, phoneFocus, nickname, phone, loading } =
    useInitController(navigation);

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.wrapper}>
        <View style={styles.logoSection}>
          <LogoIcon width={40} height={40} />
          <LogoText width={80} height={40} />
        </View>
        <Text style={styles.title}>기본 정보를 입력해주세요!</Text>
        <View>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputTitle,
                  nicknameFocus && styles.nicknameTitleFocused,
                ]}
              >
                닉네임
              </Text>
              <TextInput
                onFocus={handlers.nicknameFocus}
                onBlur={handlers.nicknameBlur}
                style={[
                  styles.input,
                  nicknameFocus && styles.nicknameInputFocused,
                ]}
                value={nickname}
                onChangeText={handlers.nicknameInput}
                placeholder="닉네임"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputTitle,
                  phoneFocus && styles.phoneTitleFocused,
                ]}
              >
                연락처
              </Text>
              <TextInput
                onFocus={handlers.phoneFocus}
                onBlur={handlers.phoneBlur}
                style={[styles.input, phoneFocus && styles.phoneInputFocused]}
                placeholder="연락처"
                value={convertPhone(phone)}
                onChangeText={handlers.phoneInput}
              />
            </View>
          </View>
          <View style={styles.buttonSection}>
            <Pressable onPress={handlers.savePress} style={styles.pressable}>
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
            <Pressable onPress={handlers.skipPress} style={styles.pressable}>
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
