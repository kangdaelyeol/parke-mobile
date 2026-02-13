import React from 'react';
import {
  ColorValue,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface PressableButtonProps {
  onPress: () => void;
  background: ColorValue[];
  title: string;
  style?: StyleProp<ViewStyle>;
}

export const PressableButton = ({
  onPress,
  background,
  title,
  style,
}: PressableButtonProps) => {
  return (
    <Pressable style={style} onPress={onPress}>
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
    borderRadius: 10,
  },
  buttonText: {
    padding: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#d3d3d3',
  },
});
