import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { convertPhone } from '@/helpers';
import { CardDto } from '@/domain/card/card-dto';
import { useSettingCardController } from '@/controllers';

export default function SettingCard({ card }: { card: CardDto }) {
  const {
    title,
    setTitle,
    message,
    setMessage,
    phone,
    setPhone,
    animatedStyle,
    handlers,
  } = useSettingCardController({ card });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.text}>Title</Text>
          <TextInput
            placeholder="Name"
            value={title}
            style={styles.input}
            onChangeText={setTitle}
          />
        </View>
        <View>
          <Text style={styles.text}>Phone</Text>
          <TextInput
            placeholder="010-1234-5678"
            value={phone}
            style={styles.input}
            onChangeText={now => {
              setPhone(convertPhone(now));
            }}
          />
        </View>
        <View>
          <Text style={styles.text}>Message</Text>
          <TextInput
            placeholder="Message"
            value={message}
            style={styles.input}
            onChangeText={setMessage}
          />
        </View>
        <View style={styles.btnContainer}>
          <Pressable style={styles.pressable} onPress={handlers.savePress}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.btn,
                  styles.saveBtn,
                  pressed && styles.saveBtnPressed,
                ]}
              >
                저장
              </Text>
            )}
          </Pressable>
          <Pressable style={styles.pressable} onPress={handlers.cancelPress}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.btn,
                  styles.cancelBtn,
                  pressed && styles.cancelBtnPressed,
                ]}
              >
                취소
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    marginTop: 0,
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    gap: 15,
  },
  text: {
    color: '#eaeaea',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    height: 40,
    fontSize: 15,
    backgroundColor: '#18171f',
    color: 'white',
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  btnContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 30,
  },
  pressable: {
    flex: 1,
  },
  btn: {
    paddingVertical: 20,
    fontSize: 25,
    textAlign: 'center',
    borderRadius: 10,
    fontWeight: 'bold',
  },
  saveBtn: {
    color: '#bcbcbc',
    backgroundColor: '#17182f',
  },
  saveBtnPressed: {
    backgroundColor: '#262b73',
  },
  cancelBtn: {
    textAlign: 'center',
    color: '#eeeeee',
    backgroundColor: '#2e2f31',
  },
  cancelBtnPressed: {
    backgroundColor: '#4e4f53',
  },
});
