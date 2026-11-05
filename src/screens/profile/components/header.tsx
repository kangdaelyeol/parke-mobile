import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PRETENDARD } from '@/theme/fonts'
import { TEXT } from '@/theme/glass'

// 탭 화면이라 뒤로 가기 없이 제목만 둔다 (아래 탭바로 이동)
export const Header = () => {
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.wrapper, { paddingTop: top + 14 }]}>
      <Text style={styles.title}>프로필</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 380,
    marginHorizontal: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  title: {
    color: TEXT.primary,
    fontSize: 26,
    fontFamily: PRETENDARD.BOLD,
    letterSpacing: -0.4,
  },
})
