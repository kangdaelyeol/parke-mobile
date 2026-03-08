import { StyleSheet, Text, View } from 'react-native'
import { LogoIcon } from '@/assets/logo'
import { DM_MONO, DM_SANS } from '@/theme/fonts'
import { useHomeContext, useUserContext } from '@/contexts'
import { convertPhone } from '@/helpers'

export const Header = () => {
  const { scanning } = useHomeContext()
  const { user } = useUserContext()
  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <LogoIcon width={35} height={35} style={styles.icon} />
        <View style={styles.textSection}>
          <Text style={styles.phone}>{convertPhone(user.phone)}</Text>
          <View style={styles.scan}>
            <View
              style={[
                styles.dot,
                scanning ? styles.scanOnDot : styles.scanOffDot,
              ]}
            />
            <Text
              style={[
                styles.scanText,
                scanning ? styles.scanOnText : styles.scanOffText,
              ]}
            >
              {scanning ? '스캔 켜짐' : '스캔 꺼짐'}
            </Text>
          </View>
        </View>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  headerWrapper: {
    marginTop: 40,
    boxSizing: 'border-box',
    height: 60,
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
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
  scan: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  scanText: {
    marginLeft: 5,
    textAlign: 'right',
    fontSize: 12,
    fontFamily: DM_SANS.MEDIUM,
  },
  scanOnText: {
    color: '#ffffff',
  },
  scanOffText: {
    color: '#8b8b8b',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  scanOnDot: {
    backgroundColor: '#57e080',
    boxShadow: '0px 0px 5px 2px #57e080',
  },
  scanOffDot: {
    backgroundColor: '#e05757',
    boxShadow: '0px 0px 5px 2px #e05757',
  },
  
})
