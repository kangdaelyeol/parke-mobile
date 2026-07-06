import {
  ColorValue,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import { DM_SANS } from '@/theme/fonts'
import { WHITE } from '@/theme/color'

interface PressableButtonProps {
  onPress: () => void
  background?: ColorValue[]
  text?: ColorValue[]
  border?: ColorValue[]
  title: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  pressableStyle?: StyleProp<ViewStyle>
}

export const PressableButton = ({
  onPress,
  background,
  title,
  style,
  textStyle,
  pressableStyle,
  text,
  border,
}: PressableButtonProps) => {
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  return (
    <Pressable onPress={onPress} style={pressableStyle}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            background && { backgroundColor: background[0] },
            background && pressed && { backgroundColor: background[1] },
            border && styles.border,
            border && { borderColor: border[0] },
            border && pressed && { borderColor: border[1] },
            style,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              isSmall && styles.buttonTextSmall,
              text && { color: text[0] },
              text && pressed && { color: text[1] },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
  },
  buttonText: {
    padding: 20,
    textAlign: 'center',
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
    color: WHITE,
  },
  buttonTextSmall: {
    padding: 12,
  },
  border: { borderWidth: 1 },
})
