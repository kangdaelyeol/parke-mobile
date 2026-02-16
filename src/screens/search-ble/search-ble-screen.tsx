import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSearchBle } from '@/controllers';
import useHeptic from '@/hooks/use-heptic';
import { Header, Rader, Title } from '@search-ble/components';

const Test = ({ devices, rssi }: { devices: any; rssi: any }) => {
  return (
    <>
      {/* test */}
      <Text
        style={{
          position: 'absolute',
          top: 60,
          color: '#eeeeee',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        스캔된 Parke 와의 거리 {rssi}
      </Text>

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
      {/* test */}
    </>
  );
};

export default function SearchBLEScreen() {
  const { devices, rssi, detected, setDetected } = useSearchBle();

  const { setTime, setHepticOption } = useHeptic();

  if (!detected && rssi) {
    setDetected(true);
    setTime(200);
    setHepticOption('impactMedium');
  }

  return (
    <View style={styles.container}>
      <Test devices={devices} rssi={rssi} />
      <Header />
      <Title detected={detected} />
      <Rader detected={detected} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#000',
  },
  list: {
    position: 'absolute',
    flex: 1,
    marginTop: 10,
    maxHeight: 300,
    bottom: 0,
  },
  deviceText: { color: '#fff', fontSize: 16, marginVertical: 4, opacity: 0.2 },
});
