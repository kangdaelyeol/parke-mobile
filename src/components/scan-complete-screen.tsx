/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useScanComplete } from '../controllers/use-scan-complete';

export default function ScanCompleteScreen({ route }: any) {
  const {
    convertedPhone,
    isKeyValid,
    deviceId,
    setPhone,
    savePhone,
    saving,
    serial,
    setSerial,
  } = useScanComplete(route);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Scan done successfully!</Text>
        <Text style={styles.label}>Enroll your phone Number!!</Text>
        <Text selectable style={styles.keyValue}>
          {isKeyValid ? `deviceId: ${deviceId}` : '(없음)'}
        </Text>
        <Text style={[styles.label, { marginTop: 16 }]}>시리얼 번호</Text>
        <TextInput
          value={serial}
          onChangeText={setSerial}
          placeholder="ABCD"
          placeholderTextColor="#777"
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={[styles.label]}>휴대폰 번호</Text>
        <TextInput
          value={convertedPhone}
          onChangeText={now => setPhone(now.replaceAll('-', ''))}
          placeholder="010-1234-5678"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Pressable
          style={[styles.button, !isKeyValid && { opacity: 0.5 }]}
          onPress={savePhone}
          disabled={!isKeyValid || saving}
        >
          {saving ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>저장</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: { color: '#bbb', fontSize: 14, marginBottom: 6 },
  keyValue: { color: '#0f0', fontSize: 16 },
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
