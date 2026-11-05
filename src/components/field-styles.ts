import { StyleSheet } from 'react-native'
import { DARK, DARK_LIGHT, GRAY, WHITE } from '@/theme/color'
import { PRETENDARD } from '@/theme/fonts'
import { glassStyles, glassText, TEXT } from '@/theme/glass'
import { useThemedSheet } from '@/theme/themed'

// 입력칸 공통 모양 (FocusableInput, EmailDomainInput)
// 기본 테마: 어두운 칸 + 회색 테두리 / 글래스: 떠 있는 유리 칸(유리 판 안에서는 파인 칸)
const glass = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: glassText.label,
  titleFocused: {
    color: TEXT.primary,
  },
  box: glassStyles.field,
  boxFocused: glassStyles.fieldFocused,
  // 유리 판 안에 놓일 때: 판보다 어둡게 파인 칸 (영상의 Target Mobile Number)
  insetBox: glassStyles.inset,
  insetBoxFocused: glassStyles.insetFocused,
  // 펼친 선택 목록
  options: glassStyles.field,
  optionPressed: glassStyles.pressed,
})

// 기본 테마 (처음 디자인). 판 안 입력칸이 따로 없어 inset도 같은 모양이다
const classicBox = {
  borderRadius: 16,
  borderWidth: 1,
  borderColor: DARK_LIGHT,
  backgroundColor: DARK,
}
const classic = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  titleFocused: {
    color: WHITE,
  },
  box: classicBox,
  boxFocused: {
    borderColor: GRAY,
  },
  insetBox: classicBox,
  insetBoxFocused: {
    borderColor: GRAY,
  },
  options: classicBox,
  optionPressed: {
    backgroundColor: DARK_LIGHT,
  },
})

// 지금 테마의 입력칸 모양. inset: 유리 판 안에 놓인 입력칸
export const useFieldStyles = (inset?: boolean) => {
  const sheet = useThemedSheet<typeof glass>({
    classic,
    'glass-dashboard': glass,
  })
  return {
    container: sheet.container,
    title: sheet.title,
    titleFocused: sheet.titleFocused,
    box: inset ? sheet.insetBox : sheet.box,
    boxFocused: inset ? sheet.insetBoxFocused : sheet.boxFocused,
    options: sheet.options,
    optionPressed: sheet.optionPressed,
  }
}
