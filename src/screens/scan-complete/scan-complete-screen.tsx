/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ScanCompleteContextProvider,
  useScanCompleteContext,
} from '@/contexts';
import { RouteProp } from '@react-navigation/native';
import { ScanCompleteStackParamList } from '@/navigation/types';
import { Main, ProgressStepper, Card, QrScan } from '@scan-complete/components';
import { Loading } from '@/components';

type ScanCompleteProps = {
  route: RouteProp<ScanCompleteStackParamList, 'ScanComplete'>;
};

type ScanCompleteBody = {
  deviceId: string;
};

const ScanCompleteBody = ({ deviceId }: ScanCompleteBody) => {
  const { state } = useScanCompleteContext();

  return (
    <>
      {state.loading && <Loading />}
      {state.scanPage && <QrScan />}
      <ProgressStepper />
      <View style={styles.wrapper}>
        <Card deviceId={deviceId} />
        <Main deviceId={deviceId} />
      </View>
    </>
  );
};

export default function ScanCompleteScreen({ route }: ScanCompleteProps) {
  const deviceId = route?.params?.value ?? 'abc';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ScanCompleteContextProvider>
          <ScanCompleteBody deviceId={deviceId} />
        </ScanCompleteContextProvider>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  wrapper: {
    marginTop: 25,
    width: '100%',
    maxWidth: 380,
    marginHorizontal: 'auto',
  },
  subTitle: {
    color: '#eee',
    fontSize: 25,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 30,
  },
  keyValue: { color: '#0f0', fontSize: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
