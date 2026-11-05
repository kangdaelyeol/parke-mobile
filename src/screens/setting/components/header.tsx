import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useHeaderViewModel } from '@setting/view-model'
import { GlassTitleBar } from '@/components'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY } from '@/theme/color'
import { themed } from '@/theme/themed'

interface HeaderProps {
  title?: string
  // 뒤로 가기 버튼 (설정 탭 자체는 아래 탭바로 이동하므로 없음)
  back?: boolean
}

// 기본 테마: 가운데 제목 + 왼쪽 ‹ (처음 디자인)
const ClassicHeader = ({ title = '설정', back = false }: HeaderProps) => {
  const { actions } = useHeaderViewModel()
  return (
    <View style={classic.wrapper}>
      {back && (
        <Pressable style={classic.backBtn} onPress={actions.backPress}>
          {({ pressed }) => (
            <FontAwesome6
              name="angle-left"
              iconStyle="solid"
              size={20}
              style={[classic.btn, pressed && classic.btnPressed]}
            />
          )}
        </Pressable>
      )}
      <Text style={classic.title}>{title}</Text>
    </View>
  )
}

// 글래스: 제목도 유리 막대 안에 (하위 화면은 막대 왼쪽에 ‹)
const GlassHeader = ({ title = '설정', back = false }: HeaderProps) => {
  const { actions } = useHeaderViewModel()
  const { top } = useSafeAreaInsets()
  return (
    <View style={[styles.wrapper, { paddingTop: top + 8 }]}>
      <GlassTitleBar
        title={title}
        onBack={back ? actions.backPress : undefined}
      />
    </View>
  )
}

export const Header = themed({
  classic: ClassicHeader,
  'glass-dashboard': GlassHeader,
})

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
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
  backBtn: {
    position: 'absolute',
    top: 62,
    left: 0,
    zIndex: 3,
  },
  btn: {
    color: '#ebebeb',
  },
  btnPressed: {
    color: GRAY,
  },
})
