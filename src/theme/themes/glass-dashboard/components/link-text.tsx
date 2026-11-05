import { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import { LINK } from '../tokens'
import { PRETENDARD } from '@/theme/fonts'

interface LinkTextProps {
  children: ReactNode
  onPress?: () => void
  style?: StyleProp<TextStyle>
}

// 링크 글자 (영상의 Hardware Token (FIDO2), Target < 50ms)
export const LinkText = ({ children, onPress, style }: LinkTextProps) => (
  <Text
    onPress={onPress}
    suppressHighlighting
    style={[styles.link, style]}
    numberOfLines={1}
  >
    {children}
  </Text>
)

const styles = StyleSheet.create({
  link: {
    color: LINK,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
})
