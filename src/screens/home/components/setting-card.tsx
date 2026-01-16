import { convertPhone } from '@/helpers';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function SettingCard() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  return (
    <View style={styles.container}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 250,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    marginTop: 20,
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    marginHorizontal: 'auto',
    gap: 20,
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
});
