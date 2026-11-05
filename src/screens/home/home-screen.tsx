import { StyleSheet, View } from 'react-native'
import { SliderContextProvider } from '@home/contexts'
import { Main } from '@home/components'
import { useHomeViewModel } from '@home/view-model'
import { SCREEN_BACKGROUND } from '@/theme/color'

const HomeScreenContent = () => {
  const { state } = useHomeViewModel()

  return (
    <View style={styles.container}>
      {/* 머리는 테마별 본문이 그린다. 로딩은 화면 전체가 아니라 카드 영역에서만 보여준다 */}
      <Main loading={state.loading} />
    </View>
  )
}

// 아래 탭바(Footer)와 카드 수정 상태(CardSettingProvider)는 탭 네비게이터에 있다
export default function HomeScreen() {
  return (
    <SliderContextProvider>
      <HomeScreenContent />
    </SliderContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
})
