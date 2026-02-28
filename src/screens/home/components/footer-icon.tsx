import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { FooterProps } from '@home/types';
import { ICON_COLOR, ICON_COLOR_PRESSED } from '@home/constants';
import { FONT } from '@/theme/fonts';

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
    fontFamily: FONT.MEDIUM,
    textAlign: 'center',
    marginTop: 6,
  },
  wrapper: {
    width: 30,
    marginTop: 5,
    alignItems: 'center',
  },
});
