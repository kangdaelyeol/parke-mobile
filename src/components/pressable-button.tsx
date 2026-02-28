import { FONT } from '@/theme/fonts';
import {
  ColorValue,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface PressableButtonProps {
  onPress: () => void;
  background: ColorValue[];
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pressableStyle?: StyleProp<ViewStyle>;
}

export const PressableButton = ({
  onPress,
  background,
  title,
  style,
  textStyle,
  pressableStyle,
}: PressableButtonProps) => {
  return (
    <Pressable onPress={onPress} style={pressableStyle}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            { backgroundColor: background[0] },
            pressed && { backgroundColor: background[1] },
            style,
          ]}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
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
    fontFamily: FONT.MEDIUM,
    fontSize: 18,
    color: '#d3d3d3',
  },
});
