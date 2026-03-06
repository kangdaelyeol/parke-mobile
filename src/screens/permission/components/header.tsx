import { FONT } from '@/theme/fonts';
import { StyleSheet, Text, View } from 'react-native';

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.title}>
          <Text style={styles.titleText}>앱 접근권한 안내</Text>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Parke의 원활한 서비스 이용을 위해{'\n'}
            다음과 같은 기능이 필요합니다.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  wrapper: {
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 'auto',
  },
  title: {
    marginTop: 100,
  },
  titleText: {
    color: '#ffffff',
    fontFamily: FONT.BOLD,
    textAlign: 'center',
    fontSize: 25,
  },
  description: {
    marginTop: 20,
  },
  descriptionText: {
    color: '#b7b7b7',
    fontFamily: FONT.REGULAR,
    textAlign: 'center',
    fontSize: 14,
  },
});
