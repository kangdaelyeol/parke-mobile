import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  handleBackPress: () => void;
}
export const Header = ({ handleBackPress }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Pressable style={styles.backBtn} onPress={handleBackPress}>
          {({ pressed }) => (
            <FontAwesome6
              name="angle-left"
              iconStyle="solid"
              size={30}
              style={{
                color: pressed ? '#666' : '#ebebeb',
              }}
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
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
    paddingBottom: 15,
  },
});
