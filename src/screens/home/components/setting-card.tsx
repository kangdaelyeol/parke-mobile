import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCardSettingContext, useCardSliderContext } from '@/contexts';
import { convertPhone } from '@/helpers';

export default function SettingCard({ card }: any) {
  const { cardSettingController } = useCardSettingContext();
  const { selectedCard } = useCardSliderContext();

  const [name, setName] = useState(card.title);
  const [phone, setPhone] = useState(card.phone);
  const [message, setMessage] = useState(card.message);
  const opacityVal = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacityVal.value, {
      duration: 400,
    }),
  }));

  useEffect(() => {
    opacityVal.value = 1;
  }, [opacityVal]);

  const onSavePress = () => {
    cardSettingController.hideSetting();
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.text}>Name</Text>
          <TextInput
            placeholder="Name"
            value={name}
            style={styles.input}
            onChangeText={setName}
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
          <Pressable style={styles.pressable} onPress={onSavePress}>
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
          <Pressable style={styles.pressable}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.btn,
                  styles.deleteBtn,
                  pressed && styles.deleteBtnPressed,
                ]}
              >
                삭제
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
  deleteBtn: {
    textAlign: 'center',
    color: '#e24444',
    backgroundColor: '#1d1616',
  },
  deleteBtnPressed: {
    backgroundColor: '#431616',
  },
});
