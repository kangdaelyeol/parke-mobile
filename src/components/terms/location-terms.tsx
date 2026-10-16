import { Text, View } from 'react-native'
import { styles } from './term-style'

// TODO: 출시 전 법률 검토 필요 (위치기반서비스사업 신고 내용과 맞출 것)
export const LocationTerms = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>[선택] 위치기반서비스 이용약관</Text>

        <Text style={styles.title}>제1조 (목적)</Text>
        <Text style={styles.paragraph}>
          이 약관은 (주)오리지널스(이하 "회사")가 제공하는 Parké 위치기반서비스(이하
          "서비스")의 이용과 관련하여 회사와 회원의 권리·의무 및 책임사항을
          규정함을 목적으로 합니다.
        </Text>

        <Text style={styles.title}>제2조 (서비스의 내용)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            1. 주행 모드: 회원이 직접 시작한 주행 동안 이동 경로, 주행 거리, 주행
            시간, 속도를 기록하고 요약을 제공합니다.
          </Text>
          <Text style={styles.item}>
            2. 운행일지: 기록된 주행 정보를 바탕으로 차량 운행기록을 작성·제공합니다.
          </Text>
        </View>

        <Text style={styles.title}>제3조 (서비스 이용요금)</Text>
        <Text style={styles.paragraph}>
          서비스는 무료로 제공됩니다. 다만 데이터 통신 요금은 회원이 가입한
          이동통신사의 정책에 따릅니다.
        </Text>

        <Text style={styles.title}>제4조 (개인위치정보의 이용 및 보유기간)</Text>
        <Text style={styles.paragraph}>
          회사는 회원이 주행 모드를 사용하는 동안에만 개인위치정보를 수집하며,
          주행 모드 사용 중에는 앱 화면이 꺼져 있어도 주행이 끝날 때까지
          수집합니다. 수집한 개인위치정보는 서비스 제공 목적을 달성하면 지체 없이
          파기하며, 운행일지는 회원 탈퇴 시 또는 관계 법령이 정한 기간까지
          보관합니다.
        </Text>

        <Text style={styles.title}>제5조 (회원의 권리)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            1. 회원은 언제든지 개인위치정보 수집·이용에 대한 동의의 전부 또는 일부를
            철회할 수 있습니다.
          </Text>
          <Text style={styles.item}>
            2. 회원은 개인위치정보의 수집·이용 사실 확인자료의 열람 또는 고지를
            요구할 수 있으며, 오류가 있는 경우 정정을 요구할 수 있습니다.
          </Text>
        </View>

        <Text style={styles.title}>제6조 (위치정보관리책임자)</Text>
        <Text style={styles.paragraph}>
          회사는 개인위치정보를 보호하기 위해 위치정보관리책임자를 지정합니다.
          {'\n'}성명: (지정 예정) · 연락처: (지정 예정)
        </Text>

        <Text style={styles.title}>제7조 (면책)</Text>
        <Text style={styles.paragraph}>
          주행 기록은 GPS 신호를 이용하므로 건물, 터널, 지하 등 환경에 따라 실제
          이동 경로 및 거리와 차이가 있을 수 있습니다.
        </Text>
      </View>
    </View>
  )
}
