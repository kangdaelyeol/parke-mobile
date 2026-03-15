/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { ScanCompleteStackParamList } from '@/navigation/types'
import { ScanCompleteContextProvider, useScanCompleteContext } from '@/contexts'
import {
  Main,
  ProgressStepper,
  Card,
  QrScan,
  Footer,
} from '@scan-complete/components'
import { Loading } from '@/components'
import { PRETENDARD } from '@/theme/fonts'

type ScanCompleteProps = {
  route: RouteProp<ScanCompleteStackParamList, 'ScanComplete'>
}

type ScanCompleteContentProps = {
  deviceId: string
}

const ScanCompleteContent = ({ deviceId }: ScanCompleteContentProps) => {
  const { state } = useScanCompleteContext()

  return (
    <View style={styles.container}>
      <Text style={styles.header}>기기 등록</Text>
      {state.loading && <Loading />}
      {state.scanPage && <QrScan />}
      <ProgressStepper />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.wrapper}>
            <Card deviceId={deviceId} />
            <Main deviceId={deviceId} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
    </View>
  )
}

export default function ScanCompleteScreen({ route }: ScanCompleteProps) {
  const deviceId = route?.params?.value ?? 'abc'

  return (
    <ScanCompleteContextProvider>
      <ScanCompleteContent deviceId={deviceId} />
    </ScanCompleteContextProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  wrapper: {
    marginTop: 25,
    width: '100%',
    maxWidth: 380,
    marginHorizontal: 'auto',
  },
  header: {
    color: '#eeeeee',
    fontSize: 20,
    marginTop: 60,
    fontFamily: PRETENDARD.BOLD,
    textAlign: 'center',
  },
})
