import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';

const ICON_COLOR = '#e7e7e7';
const ICON_COLOR_PRESSED = '#f3f3f3';

interface FooterProps {
  label: string;
  iconName: any;
  onPress: () => void;
}

export const FooterIcon = ({ label, iconName, onPress }: FooterProps) => {
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
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

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
