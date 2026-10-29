import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6'
import { DriveRecordHeaderProps } from '@/screens/drive-record/types'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY } from '@/theme/color'

export const Header = ({ title, onBack }: DriveRecordHeaderProps) => (
  <View style={styles.wrapper}>
    <Pressable style={styles.backBtn} onPress={onBack} hitSlop={10}>
      {({ pressed }) => (
        <FontAwesome6
          name="angle-left"
          iconStyle="solid"
          size={20}
          style={[styles.btn, pressed && styles.btnPressed]}
        />
      )}
    </Pressable>
    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>
  </View>
)

const styles = StyleSheet.create({
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
    paddingHorizontal: 30,
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
