import { StyleSheet, Text, View } from 'react-native';
import { OnBoardingIcon3 } from '@/assets/illustrations';

export const MainArticle3 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>지금 시작하세요</Text>
      <Text style={styles.subTitle}>
        PARKE와 함께 스마트한 주차 경험을 시작하세요
      </Text>
      <OnBoardingIcon3 width={350} height={300} style={styles.illustrator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 35,
  },
  subTitle: {
    color: '#666666',
    fontSize: 20,
    fontWeight: 500,
    marginTop: 15,
    letterSpacing: -0.1,
  },
  illustrator: {
    marginTop: 70,
    marginHorizontal: 'auto',
  },
});
