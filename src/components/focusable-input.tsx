import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FocusableInputProps {
  title: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
}

export const FocusableInput = ({
  title,
  value,
  onChangeText,
  placeholder,
}: FocusableInputProps) => {
  const [focus, setFocus] = useState(false);
  const onFocus = () => setFocus(true);
  const offFocus = () => setFocus(false);
  return (
    <View style={styles.container}>
      <Text style={[styles.title, focus && styles.titleFocused]}>{title}</Text>
      <TextInput
        onFocus={onFocus}
        onBlur={offFocus}
        style={[styles.input, focus && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
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
  title: {
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleFocused: {
    color: '#eeeeee',
  },
  inputFocused: {
    borderColor: '#eeeeee',
  },
});
