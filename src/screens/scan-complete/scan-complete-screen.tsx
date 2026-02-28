/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ScanCompleteStackParamList } from '@/navigation/types';
import {
  ScanCompleteContextProvider,
  useScanCompleteContext,
} from '@/contexts';
import { Main, ProgressStepper, Card, QrScan } from '@scan-complete/components';
import { Loading } from '@/components';

type ScanCompleteProps = {
  route: RouteProp<ScanCompleteStackParamList, 'ScanComplete'>;
};

type ScanCompleteContentProps = {
  deviceId: string;
};

const ScanCompleteContent = ({ deviceId }: ScanCompleteContentProps) => {
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
          <ScanCompleteContent deviceId={deviceId} />
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
});
