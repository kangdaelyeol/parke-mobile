import { Text, View } from 'react-native'
import { styles } from './term-style'

export const Consent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>[필수] 개인정보 수집·이용 동의</Text>
        <Text style={styles.paragraph}>
          (주)오리지널스(이하 "회사")는 서비스 제공을 위해 아래와 같이
          개인정보를 수집·이용하고자 합니다. 내용을 자세히 읽으신 후 동의 여부를
          결정하여 주십시오.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>수집 항목</Text>
            <Text style={styles.tableHead}>수집 목적</Text>
            <Text style={styles.tableHead}>보유 및 이용 기간</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableData}>닉네임, 이메일</Text>
            <Text style={styles.tableData}>
              회원 가입 및 관리, 본인 식별, 서비스 관련 공지·안내
            </Text>
            <Text style={styles.tableData}>회원 탈퇴 시까지</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>휴대전화번호</Text>
            <Text style={styles.tableData}>
              주차 QR코드 서비스 제공, 차량 이동 요청 시 연락 중개
            </Text>
            <Text style={styles.tableData}>회원 탈퇴 시까지</Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          ※ 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만,
          동의를 거부하시는 경우 회원가입 및 서비스 이용이 제한됩니다.
        </Text>
      </View>
    </View>
  )
}
