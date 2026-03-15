import { StyleSheet, Text, View } from 'react-native'
import { Camera } from 'react-native-vision-camera'
import { LogoText, PressableButton } from '@/components'
import { useScanCompleteQrScanViewModel } from '@/view-model'
import { BLUE_PRIMARY, WHITE } from '@/theme/color'
import { DM_SANS } from '@/theme/fonts'

export const QrScan = () => {
  const { state, actions } = useScanCompleteQrScanViewModel()
  if (!state.device)
    return (
      <View style={styles.container}>
        <Text style={styles.waiting}>카메라를 찾는 중</Text>
        <PressableButton
          pressableStyle={styles.button}
          background={['#202020', '#414141']}
          title="돌아가기"
          onPress={actions.scanBackPress}
        />
      </View>
    )

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <LogoText fontSize={24} letterSpacing={4.5} />
        </View>
        <Text style={styles.title}>Parke에 각인된 QR 코드를 스캔해주세요</Text>
        <Camera
          codeScanner={actions.codeScanner as any}
          style={styles.camera}
          device={state.device}
          isActive={!state.scanned}
        />
        <PressableButton
          pressableStyle={styles.button}
          background={[BLUE_PRIMARY, '#1820ff']}
          title="돌아가기"
          onPress={actions.scanBackPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: '#000',
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 10,
    maxWidth: 360,
  },
  title: {
    color: WHITE,
    marginTop: 19,
    fontSize: 17,
    fontFamily: DM_SANS.BOLD,
    textAlign: 'center',
  },
  camera: {
    marginTop: 50,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    marginTop: 40,
  },
  logoContainer: {
    marginTop: 80,
    marginHorizontal: 'auto',
  },
  waiting: {
    fontSize: 30,
    color: WHITE,
    marginTop: 60,
  },
})
