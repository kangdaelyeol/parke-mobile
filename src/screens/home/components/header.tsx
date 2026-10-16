import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { HomeStackNavigationProp } from '@/navigation/types'
import { SHOW_DRIVE_TEST_BUTTON } from '@/constants'
import { LogoIcon } from '@/assets/logo'
import { DM_MONO, DM_SANS } from '@/theme/fonts'
import { useBackgroundScanning } from '@/hooks'
import { useUserContext } from '@/contexts'
import { GRAY, GREEN, RED, WHITE } from '@/theme/color'
import { formatPhone } from '@/utils'

export const Header = () => {
  const scanning = useBackgroundScanning()
  const navigation = useNavigation<HomeStackNavigationProp>()
  const { user } = useUserContext()
  const { width } = useWindowDimensions()
  const isSmall = width < 400
  const iconSize = isSmall ? 28 : 35

  return (
    <View style={styles.header}>
      <View
        style={[styles.headerWrapper, isSmall && styles.headerWrapperSmall]}
      >
        <LogoIcon width={iconSize} height={iconSize} style={styles.icon} />
        {SHOW_DRIVE_TEST_BUTTON && (
          // [임시] 기기 없이 주행모드 테스트
          <Pressable
            onPress={() => navigation.navigate('Drive', {})}
            style={[styles.driveTest, { left: iconSize + 24 }]}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.driveTestText,
                  pressed && styles.driveTestPressed,
                ]}
              >
                주행 테스트
              </Text>
            )}
          </Pressable>
        )}
        <View style={styles.textSection}>
          <Text style={[styles.phone, isSmall && styles.phoneSmall]}>
            {formatPhone(user?.phone || '')}
          </Text>
          <View style={[styles.scan, isSmall && styles.scanSmall]}>
            <View
              style={[
                styles.dot,
                isSmall && styles.dotSmall,
                scanning ? styles.scanOnDot : styles.scanOffDot,
              ]}
            />
            <Text
              style={[
                styles.scanText,
                isSmall && styles.scanTextSmall,
                scanning ? styles.scanOnText : styles.scanOffText,
              ]}
            >
              {scanning ? '스캔 켜짐' : '스캔 꺼짐'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#000000',
    zIndex: 1,
  },
  headerWrapper: {
    maxWidth: 400,
    marginTop: 40,
    boxSizing: 'border-box',
    height: 60,
    width: '100%',
    marginHorizontal: 'auto',
  },
  headerWrapperSmall: {
    maxWidth: 350,
    marginTop: 30,
    height: 40,
  },
  driveTest: {
    position: 'absolute',
    top: 17,
  },
  driveTestText: {
    color: WHITE,
    backgroundColor: '#383bf9',
    fontFamily: DM_SANS.BOLD,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  driveTestPressed: {
    backgroundColor: '#1732ff',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 12,
  },
  textSection: {
    right: 10,
    top: 15,
    position: 'absolute',
  },
  phone: {
    color: '#ebebeb',
    textAlign: 'right',
    fontSize: 18,
    fontFamily: DM_MONO.MEDIUM,
  },
  phoneSmall: {
    fontSize: 14,
  },
  scan: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scanSmall: {
    marginTop: 3,
  },
  scanText: {
    marginLeft: 5,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: DM_SANS.BOLD,
  },
  scanTextSmall: {
    fontSize: 10,
  },
  scanOnText: {
    color: WHITE,
  },
  scanOffText: {
    color: GRAY,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  scanOnDot: {
    backgroundColor: GREEN,
    boxShadow: `0px 0px 6px ${GREEN}`,
  },
  scanOffDot: {
    backgroundColor: RED,
    boxShadow: `0px 0px 6px ${RED}`,
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#2a2a2a',
    marginTop: 15,
    marginHorizontal: 'auto',
  },
})
