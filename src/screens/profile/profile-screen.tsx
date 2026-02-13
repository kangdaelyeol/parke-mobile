import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProfileController } from '@/controllers';
import { convertPhone } from '@/helpers';
import { FocusableInput, Loading } from '@/components';
import { Header } from './components/header';
import { ProfileStackNavigationProp } from '@/navigation/types';

export default function ProfileScreen({
  navigation,
}: {
  navigation: ProfileStackNavigationProp;
}) {
  const { handlers, nickname, phone, loading } =
    useProfileController(navigation);
  return (
    <View style={styles.container}>
      <Header handleBackPress={handlers.backPress} />
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
  inputTitle: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 16,
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
