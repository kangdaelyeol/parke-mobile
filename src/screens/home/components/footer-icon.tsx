import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const ICON_COLOR = '#e7e7e7';
const ICON_COLOR_PRESSED = '#f3f3f3';

export default function FooterIcon({ name, iconName, onPress }: any) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={styles.wrapper}>
          <FontAwesome6
            name={iconName}
            iconStyle="solid"
            style={{
              color: pressed ? ICON_COLOR_PRESSED : ICON_COLOR,
            }}
            size={27}
          />
          <Text
            style={[
              {
                color: pressed ? ICON_COLOR_PRESSED : ICON_COLOR,
              },
              styles.title,
            ]}
          >
            {name}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },
  wrapper: {
    width: 30,
    marginTop: 5,
    alignItems: 'center',
  },
});
