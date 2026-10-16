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

  const isSmall = width < 400

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
        <View style={[styles.section, isSmall && styles.sectionSmall]}>
          <Text style={[styles.title, isSmall && styles.titleSmall]}>
            필수적 접근 권한
          </Text>
          <Text style={[styles.noneText, isSmall && styles.noneTextSmall]}>
            없음
          </Text>
        </View>
        <View style={[styles.section, isSmall && styles.sectionSmall]}>
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
            <ItemDivider />
            <Item
              title="위치"
              subTitle="주행 모드에서 이동 경로·거리 기록시 사용 (주행 중에는 화면이 꺼져도 기록)"
              option="location"
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
  containerSmall: {
    marginTop: 15,
  },
  wrapper: {
    marginHorizontal: 'auto',
    width: '100%',
    maxWidth: 360,
  },
  wrapperSmall: {
    maxWidth: 340,
  },
  section: {
    marginTop: 20,
  },
  sectionSmall: {
    marginTop: 10,
  },
  title: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 16,
  },
  titleSmall: {
    fontSize: 15,
  },
  noneText: {
    color: GRAY_DEEP,
    fontFamily: PRETENDARD.MEDIUM,
    paddingVertical: 17,
    fontSize: 16,
  },
  noneTextSmall: { paddingVertical: 4, fontSize: 12 },
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
