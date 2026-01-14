import { LogoIcon } from '@/assets/logo';
import { cache } from '@/storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function Header() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <LogoIcon width={35} height={35} style={styles.icon} />
        <Pressable
          style={styles.settingBtn}
          onPress={() => {
            cache.setHasSeenOnBoarding(false);
            navigation.navigate('Setting');
          }}
        >
          {({ pressed }) => {
            return (
              <FontAwesome6
                name="gear"
                iconStyle="solid"
                size={35}
                style={{ color: pressed ? '#666' : '#fff' }}
              />
            );
          }}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // backgroundColor: 'white',
    width: '100%',
  },
  headerWrapper: {
    marginTop: 40,
    boxSizing: 'border-box',
    height: 60,
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },

  settingBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 12,
  },
});
