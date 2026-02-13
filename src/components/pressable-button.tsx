import React from 'react';
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native';

interface PressableButtonProps {
  onPress: () => void;
  background: ColorValue[];
  title: string;
}

export const PressableButton = ({
  onPress,
  background,
  title,
}: PressableButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            { backgroundColor: background[0] },
            pressed && { backgroundColor: background[1] },
          ]}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#d3d3d3',
  },
});
