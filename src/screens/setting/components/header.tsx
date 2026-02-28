import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useSettingHeaderViewModel } from '@/view-model';
import { FONT } from '@/theme/fonts';

export const Header = () => {
  const { actions } = useSettingHeaderViewModel();
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable style={styles.backBtn} onPress={actions.backPress}>
          {({ pressed }) => (
            <FontAwesome6
              name="angle-left"
              iconStyle="solid"
              size={30}
              style={[styles.btn, pressed && styles.btnPressed]}
            />
          )}
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#444444',
    borderBottomWidth: 1,
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
  title: {
    color: '#eeeeee',
    fontSize: 30,
    marginTop: 50,
    fontFamily: FONT.MEDIUM,
    textAlign: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 0,
    zIndex: 3,
  },
  btn: {
    color: '#ebebeb',
  },
  btnPressed: {
    color: '#666',
  },
});
