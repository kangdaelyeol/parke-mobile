/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScanCompleteContextProvider } from '@/contexts/scan-complete-context';
import { Main, ProgressStepper, Card } from './components';
export default function ScanCompleteScreen({ route }: any) {
  const deviceId = route?.params?.value ?? 'abc';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ScanCompleteContextProvider>
          <ProgressStepper />
          <View style={styles.wrapper}>
            <Text selectable style={styles.keyValue}>
              {deviceId && deviceId.length ? `deviceId: ${deviceId}` : '(없음)'}
            </Text>
            <Card />
            <Main />
          </View>
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
