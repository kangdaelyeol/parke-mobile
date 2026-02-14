import { StyleSheet, Text, View } from 'react-native';
import { OnBoardingIcon2 } from '@/assets/illustrations';

export const MainArticle2 = () => {
  return (
    <View style={styles.container}>
      <OnBoardingIcon2 width={350} height={290} style={styles.illustrator} />
      <Text style={styles.title}>
        QR 스캔시 운전자에 맞는{'\n'}번호 자동 전환
      </Text>

      <Text style={styles.subTitle}>
        BLE 기반으로 운전자를 자동 인식하여{'\n'}실시간으로 연락처를 변경합니다
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  illustrator: {
    marginTop: 50,
    marginHorizontal: 'auto',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 40,
    marginTop: 40,
  },
  subTitle: {
    color: '#777777',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 25,
  },
});
