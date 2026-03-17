import { Pressable, StyleSheet, Text, View } from 'react-native'
import { DM_SANS } from '@/theme/fonts'
import { useNavigation } from '@react-navigation/native'
import { HomeStackNavigationProp } from '@/navigation/types'
import { GRAY, WHITE } from '@/theme/color'
import { CarIllustration } from './illustrations'

export const EmptyView = () => {
  const navigation = useNavigation<HomeStackNavigationProp>()
  const onButtonPress = () => {
    navigation.navigate('SearchBLE')
  }
  return (
    <View style={styles.container}>
      <CarIllustration width={150} height={150} />
      <Text style={styles.title}>등록된 기기가 없어요</Text>
      <Text style={styles.description}>
        BLE 기기를 등록하면{'\n'}자동으로 전화번호가 관리됩니다
      </Text>
      <Pressable onPress={onButtonPress}>
        {({ pressed }) => (
          <Text style={[styles.button, pressed && styles.buttonPressed]}>
            기기 등록하기
          </Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 18,
    marginTop: 20,
  },
  description: {
    color: GRAY,
    textAlign: 'center',
    fontFamily: DM_SANS.MEDIUM,
    marginTop: 18,
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#1a28a1',
    color: WHITE,
    fontFamily: DM_SANS.MEDIUM,
    borderRadius: 300,
    marginTop: 20,
    fontSize: 16,
  },
  buttonPressed: {
    backgroundColor: '#2534be',
  },
})
