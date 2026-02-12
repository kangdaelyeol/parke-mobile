import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { OnBoardingIcon1_1 } from '@/assets/illustrations';

export const MainArticle1 = () => {
  const DEVICE_WIDTH = Dimensions.get('window').width;
  return (
    <View style={[{ width: DEVICE_WIDTH }]}>
      <OnBoardingIcon1_1 style={styles.onBoardingIllustrator1} width={350} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>가족이 함께 쓰는 차량, 전화번호는?</Text>
        <Text style={styles.subTitle}>
          운전자가 바뀔 때마다 주차번호판을 교체하는 불편함
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 150,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: 'white',
    fontWeight: '700',
  },
  subTitle: {
    marginTop: 20,
    fontSize: 17,
    color: 'gray',
  },
  onBoardingIllustrator1: {
    marginTop: 130,
    marginHorizontal: 'auto',
  },
});
