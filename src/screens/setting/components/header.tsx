import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6'
import { useSettingHeaderViewModel } from '@/view-model'
import { PRETENDARD } from '@/theme/fonts'

export const Header = () => {
  const { actions } = useSettingHeaderViewModel()
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable style={styles.backBtn} onPress={actions.backPress}>
          {({ pressed }) => (
            <FontAwesome6
              name="angle-left"
              iconStyle="solid"
              size={20}
              style={[styles.btn, pressed && styles.btnPressed]}
            />
          )}
        </Pressable>
        <Text style={styles.title}>설정</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
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
    color: '#666',
  },
})
