import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useSearchBLEHeaderViewModel } from '@/view-model';

export const Header = () => {
  const { actions } = useSearchBLEHeaderViewModel();
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
  },

  backBtn: {
    position: 'absolute',
    top: 55,
    left: 0,
    zIndex: 3,
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
  btn: {
    color: '#ebebeb',
  },
  btnPressed: {
    color: '#666',
  },
});
