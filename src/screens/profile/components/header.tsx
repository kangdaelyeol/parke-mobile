import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PRETENDARD } from '@/theme/fonts'
import { themed } from '@/theme/themed'

// 탭 화면이라 뒤로 가기 없이 제목만 둔다 (아래 탭바로 이동)

// 기본 테마: 가운데 제목 (처음 디자인)
const ClassicHeader = () => (
  <View style={classic.wrapper}>
    <Text style={classic.title}>프로필</Text>
  </View>
)

// 글래스: 제목은 본문 유리 판 맨 위에 있다. 여기서는 위 여백만 둔다
const GlassHeader = () => {
  const { top } = useSafeAreaInsets()
  return <View style={{ height: top + 8 }} />
}

export const Header = themed({
  classic: ClassicHeader,
  'glass-dashboard': GlassHeader,
})

// 기본 테마 (처음 디자인)
const classic = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
  title: {
    color: '#eeeeee',
    fontSize: 20,
    marginTop: 60,
    fontFamily: PRETENDARD.BOLD,
    textAlign: 'center',
  },
})
