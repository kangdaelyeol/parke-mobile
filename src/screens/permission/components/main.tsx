import { StyleSheet, Text, View } from 'react-native'
import { Item, ItemDivider, ItemList } from '@/components'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GRAY, GRAY_DEEP } from '@/theme/color'

const Badge = () => {
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>선택</Text>
    </View>
  )
}

export const Main = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={styles.title}>필수적 접근 권한</Text>
          <Text style={styles.noneText}>없음</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>선택적 접근 권한</Text>
          <ItemList>
            <Item
              title="사진 카메라"
              subTitle="Parké 제품의 QR 코드 스캔시 사용"
              option="camera"
              Right={Badge}
            />
            <ItemDivider />
            <Item
              title="알림"
              subTitle="휴대폰번호 변경 여부 및 변경 완료 알림시 사용"
              option="notify"
              Right={Badge}
            />
            <ItemDivider />
            <Item
              title="블루투스"
              subTitle="Parké 장치 탐색시 사용"
              option="bluetooth"
              Right={Badge}
            />
          </ItemList>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 360,
  },
  section: {
    marginTop: 20,
  },
  title: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
  },
  noneText: {
    paddingVertical: 17,
    color: GRAY_DEEP,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 16,
  },
  badgeContainer: {
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#1a1a2a',
  },
  badgeText: {
    color: '#7777cc',
    fontFamily: PRETENDARD.BOLD,
    fontSize: 12,
  },
})
