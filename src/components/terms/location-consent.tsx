import { Text, View } from 'react-native'
import { styles } from './term-style'

// TODO: 출시 전 법률 검토 필요
export const LocationConsent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>[선택] 개인위치정보 수집·이용 동의</Text>
        <Text style={styles.paragraph}>
          (주)오리지널스(이하 "회사")는{' '}
          <Text style={styles.strong}>
            「위치정보의 보호 및 이용 등에 관한 법률」
          </Text>
          에 따라 아래와 같이 개인위치정보를 수집·이용하고자 합니다.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>수집 항목</Text>
            <Text style={styles.tableHead}>수집 목적</Text>
            <Text style={styles.tableHead}>보유 및 이용 기간</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>
              위치(위도·경도), 측정 시각, 이동 속도
            </Text>
            <Text style={styles.tableData}>
              주행 경로·거리 기록, 주행 요약 및 운행일지 제공
            </Text>
            <Text style={styles.tableData}>
              회원 탈퇴 또는 동의 철회 시까지 (관계 법령에 따른 보관 의무가 있는
              경우 해당 기간)
            </Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          ※ 개인위치정보는 회원이 주행 모드를 직접 시작한 경우에만 수집하며, 주행
          중에는 앱 화면이 꺼져 있어도 주행이 끝날 때까지 수집합니다.
        </Text>
        <Text style={styles.paragraph}>
          ※ 동의를 거부할 권리가 있으며, 거부하시는 경우 주행 모드와 운행일지
          기능을 이용할 수 없습니다. 그 외 서비스 이용에는 제한이 없습니다.
        </Text>
      </View>
    </View>
  )
}
