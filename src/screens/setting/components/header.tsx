import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderViewModel } from '@setting/view-model'
import { GlassIconButton } from '@/components'
import { PRETENDARD } from '@/theme/fonts'
import { TEXT } from '@/theme/glass'

// back: 뒤로 가기 버튼 (설정 탭 자체는 아래 탭바로 이동하므로 없음)
export const Header = ({
  title = '설정',
  back = false,
}: {
  title?: string
  back?: boolean
}) => {
  const { actions } = useHeaderViewModel()
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.wrapper, { paddingTop: top + 14 }]}>
      {back && (
        <GlassIconButton
          round
          size={36}
          icon="chevron-left"
          onPress={actions.backPress}
        />
      )}
      <Text style={[styles.title, back && styles.titleSub]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 18,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    color: TEXT.primary,
    fontSize: 26,
    fontFamily: PRETENDARD.BOLD,
    letterSpacing: -0.4,
  },
  // 하위 화면은 뒤로 가기 옆에 조금 작게
  titleSub: {
    fontSize: 20,
  },
})
