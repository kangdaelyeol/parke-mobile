import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Radar from './common/rader';
import { useSearchBle } from '../controllers/use-search-ble';

export default function SearchBLEScreen() {
  const { devices } = useSearchBle();

  return (
    <View style={styles.container}>
      <Text style={styles.uptext}>Searching BLE Tag</Text>
      <Radar style={styles.raderStyle} />

      <ScrollView style={styles.list}>
        {devices.length === 0 ? (
          <Text style={styles.deviceText}>아직 스캔된 장치가 없습니다.</Text>
        ) : (
          devices.map(d => (
            <Text key={d.id} style={styles.deviceText}>
              • {d.name ?? '(이름 없음)'} ({d.id})
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  uptext: {
    color: '#fff',
    fontSize: 37,
    fontWeight: 500,
    textAlign: 'center',
    marginTop: 170,
  },
  raderStyle: {
    marginTop: 70,
  },
  list: { flex: 1, marginTop: 10 },
  deviceText: { color: '#fff', fontSize: 16, marginVertical: 4 },
});
