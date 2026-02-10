import { useProfileController } from '@/controllers';
import { convertPhone } from '@/helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header } from './components/header';
import { Loading } from '@/components';

type ProfileStackParamList = {
  Profile: undefined;
  Home: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { handlers, nicknameFocus, phoneFocus, nickname, phone, loading } =
    useProfileController(navigation);
  return (
    <View style={styles.container}>
      <Header handleBackPress={handlers.backPress} />
      <View style={styles.wrapper}>
        {loading && <Loading />}
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
          <Pressable onPress={handlers.savePress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  styles.saveBtn,
                  pressed && styles.saveBtnPressed,
                ]}
              >
                <Text style={styles.buttonText}>저장</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={handlers.logoutPress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  styles.logoutBtn,
                  pressed && styles.logoutBtnPressed,
                ]}
              >
                <Text style={styles.buttonText}>로그아웃</Text>
              </View>
            )}
          </Pressable>
          <Pressable onPress={handlers.deletePress}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  styles.deleteBtn,
                  pressed && styles.deleteBtnPressed,
                ]}
              >
                <Text style={styles.buttonText}>회원탈퇴</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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
    marginTop: 35,
    gap: 15,
  },
  button: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: '#262e83',
  },
  saveBtnPressed: {
    backgroundColor: '#29457e',
  },
  logoutBtn: {
    backgroundColor: '#2d2d2d',
  },
  logoutBtnPressed: {
    backgroundColor: '#525252',
  },
  deleteBtn: {
    backgroundColor: '#9d2f2f',
  },
  deleteBtnPressed: {
    backgroundColor: '#b23535',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#d3d3d3',
  },
});
