import { StyleSheet } from 'react-native'

// 반투명 유리 느낌: 옅은 흰 배경 + 얇은 밝은 테두리, 위쪽 테두리를 더 밝게 해 빛을 받는 느낌을 준다
export const GLASS = {
  fill: 'rgba(255,255,255,0.06)',
  fillActive: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.12)',
  borderActive: 'rgba(255,255,255,0.3)',
  highlight: 'rgba(255,255,255,0.22)',
  pressed: 'rgba(255,255,255,0.08)',
  glow: '0px 0px 14px rgba(255,255,255,0.08)',
}

// '#RRGGBB' → 'rgba(r,g,b,alpha)'
export const withAlpha = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r},${g},${b},${alpha})`
}

// 입력칸·선택 목록 공통 스타일
export const glassStyles = StyleSheet.create({
  field: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    borderTopColor: GLASS.highlight,
    backgroundColor: GLASS.fill,
  },
  fieldFocused: {
    borderColor: GLASS.borderActive,
    backgroundColor: GLASS.fillActive,
    boxShadow: GLASS.glow,
  },
  pressed: {
    backgroundColor: GLASS.pressed,
  },
})
