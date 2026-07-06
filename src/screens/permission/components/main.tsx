import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
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
  const { width } = useWindowDimensions()
  const style =
    width < 400
      ? {
          titleStyle: {
            fontSize: 15,
          },
          subTitleStyle: { fontSize: 13, marginTop: 10 },
          container: {
            marginTop: 15,
          },
          section: {
            marginTop: 5,
          },
          noneText: {
            paddingVertical: 4,
            fontSize: 12,
          },
        }
      : {
          titleStyle: {
            fontSize: 16,
          },
          subTitleStyle: {
            fontSize: 16,
            marginTop: 10,
            lineHeight: 22,
          },
          container: {
            marginTop: 25,
          },
          section: {
            marginTop: 20,
          },
          noneText: {
            paddingVertical: 17,
            fontSize: 16,
          },
        }
  return (
    <View style={{ ...styles.container, ...style.container }}>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={{ ...styles.title, ...style.titleStyle }}>
            필수적 접근 권한
          </Text>
          <Text style={{ ...styles.noneText, ...style.noneText }}>없음</Text>
        </View>
        <View style={style.section}>
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
