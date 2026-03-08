import { Pressable, StyleSheet, Text, View } from 'react-native'
import { PRETENDARD } from '@/theme/fonts'
import { usePermissionFooterViewModel } from '@/view-model/use-permission-footer-view-model'

export const Footer = () => {
  const { actions } = usePermissionFooterViewModel()
  return (
    <View style={styles.container}>
      <Text style={styles.description} lineBreakStrategyIOS="hangul-word">
        선택적 접근 권한은 해당 기능을 사용할 때만 허용이 필요합니다.{'\n'}
        비허용시에도 해당 기능 외 서비스 이용이 가능합니다. 허용 상태는 휴대폰
        {'\u200B'} 설정{'\u200B'} 메뉴에서 변경할 수 있습니다.{'\n'}
      </Text>
      <Pressable onPress={actions.onConfirmPress}>
        {({ pressed }) => (
          <Text style={[styles.confirm, pressed && styles.confirmPressed]}>
            확인
          </Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirm: {
    color: '#eeeeee',
    backgroundColor: '#2860d8',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 17,
  },
  confirmPressed: {
    backgroundColor: '#2150b5',
  },
  description: {
    backgroundColor: '#121212',
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#888888',
    fontSize: 11,
    fontFamily: PRETENDARD.REGULAR,
    lineHeight: 14,
  },
})
