import { StyleSheet, View, Text } from 'react-native';
import { Header, Radar, Title } from '@search-ble/components';
import { SearchBleProvider } from '@/contexts';
import { useSearchBleViewModel } from '@/view-model';
import { bleService } from '@/services';

const Test = () => {
  const { state } = useSearchBleViewModel();
  const { isSearching } = bleService.getState();
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
        {isSearching && 'scan!'} 스캔된 Parke 와의 거리 {state.rssi}
      </Text>

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
});
