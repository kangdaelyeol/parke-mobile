import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useProfileHeaderViewModel } from '@/view-model';

export const Header = () => {
  const { actions } = useProfileHeaderViewModel();
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
        <Text style={styles.title}>Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#444444',
  },
  title: {
    color: '#eeeeee',
    fontSize: 30,
    marginTop: 50,
    fontWeight: 500,
    textAlign: 'center',
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
