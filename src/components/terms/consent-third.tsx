import { Text, View } from 'react-native'
import { styles } from './term-style'

export const ConsentThird = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>[필수] 개인정보 제3자 제공 동의</Text>
        <Text style={styles.paragraph}>
          (주)오리지널스(이하 "회사")는 주차 QR코드 서비스 제공을 위해 아래와
          같이 개인정보를 제3자에게 제공하고자 합니다. 내용을 자세히 읽으신 후
          동의 여부를 결정하여 주십시오.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>제공받는 자</Text>
            <Text style={styles.tableHead}>제공 목적</Text>
            <Text style={styles.tableHead}>제공 항목</Text>
            <Text style={styles.tableHead}>보유 및 이용 기간</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>
              주차 QR코드를 스캔한 이용자 (차량 이동 요청자)
            </Text>
            <Text style={styles.tableData}>
              주차 차량 이동 요청을 위한 연락
            </Text>
            <Text style={styles.tableData}>휴대전화번호</Text>
            <Text style={styles.tableData}>
              연락 목적 달성 시 즉시 파기 (화면 표시 종료 시)
            </Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          ※ QR코드를 스캔한 이용자는 귀하의 휴대전화번호를 확인할 수 있으며,
          이는 주차 차량 이동 요청 목적으로만 사용됩니다.
        </Text>
        <Text style={styles.paragraph}>
          ※ 위 개인정보 제3자 제공에 대한 동의를 거부할 권리가 있습니다. 다만,
          동의를 거부하시는 경우 주차 QR코드 생성 및 관련 서비스 이용이
          제한됩니다.
        </Text>
      </View>
    </View>
  )
}
