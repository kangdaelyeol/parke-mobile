import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Header, Radar, Title } from '@search-ble/components';
import { SearchBleProvider } from '@/contexts';
import { useSearchBleViewModel } from '@/view-model';

const Test = () => {
  const { state } = useSearchBleViewModel();
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
        스캔된 Parke 와의 거리 {state.rssi}
      </Text>

      <ScrollView style={styles.list}>
        {state.devices.length === 0 ? (
          <Text style={styles.deviceText}>아직 스캔된 장치가 없습니다.</Text>
        ) : (
          state.devices.map(d => (
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

export default function SearchBleScreen() {
  return (
    <SearchBleProvider>
      <View style={styles.container}>
        <Test />
        <Header />
        <Title />
        <Radar />
      </View>
    </SearchBleProvider>
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
