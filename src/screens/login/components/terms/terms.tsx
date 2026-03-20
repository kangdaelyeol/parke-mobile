import { Text, View } from 'react-native'
import { styles } from './term-style'

export const Terms = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>[필수] 서비스 이용약관</Text>
        <Text style={styles.title}>제1조 (목적)</Text>
        <Text style={styles.paragraph}>
          본 약관은 (주)오리지널스(이하 "회사")가 제공하는 주차 QR코드
          서비스(이하 "서비스")의 이용에 관한 회사와 이용자 간의 권리, 의무 및
          책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </Text>

        <Text style={styles.title}>제2조 (용어의 정의)</Text>
        <Text style={styles.paragraph}>
          본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · "서비스"란 회사가 제공하는 주차 QR코드 생성, 차량 이동 요청 연락
            등 관련 제반 서비스를 의미합니다.
          </Text>
          <Text style={styles.item}>
            · "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을
            의미합니다.
          </Text>
          <Text style={styles.item}>
            · "회원"이란 회사에 개인정보를 제공하고 회원등록을 한 자로서,
            서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
          </Text>
          <Text style={styles.item}>
            · "QR코드"란 이용자가 자신의 차량 정보와 연락처를 담아 생성한
            코드로, 제3자가 스캔하여 차량 이동을 요청할 수 있는 수단을
            의미합니다.
          </Text>
        </View>

        <Text style={styles.title}>제3조 (약관의 효력 및 변경)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
          </Text>
          <Text style={styles.item}>
            · 회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수
            있으며, 변경 시 적용일자 및 변경사유를 명시하여 현행 약관과 함께
            서비스 내 공지사항에 적용일자 7일 전부터 공지합니다.
          </Text>
          <Text style={styles.item}>
            · 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고
            회원 탈퇴를 할 수 있습니다.
          </Text>
        </View>

        <Text style={styles.title}>제4조 (회원가입 및 계정)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 이용자는 카카오 로그인을 통해 회원가입을 할 수 있습니다.
          </Text>
          <Text style={styles.item}>
            · 회원가입 시 본 약관, 개인정보 수집·이용에 대한 동의가 필요합니다.
          </Text>
          <Text style={styles.item}>
            · 회원은 등록 정보에 변경이 있는 경우 즉시 수정하여야 합니다.
          </Text>
          <Text style={styles.item}>
            · 회원의 계정 관리 책임은 회원 본인에게 있으며, 타인에게 계정을
            양도하거나 대여할 수 없습니다.
          </Text>
        </View>

        <Text style={styles.title}>제5조 (서비스의 제공 및 변경)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회사는 다음의 서비스를 제공합니다: 주차 QR코드 생성 및 관리,
            QR코드 스캔을 통한 차량 이동 요청 연락 중개, 기타 회사가 정하는 관련
            서비스.
          </Text>
          <Text style={styles.item}>
            · 회사는 서비스의 내용을 변경할 수 있으며, 변경 시 변경 내용을
            사전에 공지합니다.
          </Text>
        </View>

        <Text style={styles.title}>제6조 (서비스 이용 제한)</Text>
        <Text style={styles.paragraph}>
          회사는 이용자가 다음 각 호에 해당하는 행위를 한 경우, 서비스 이용을
          제한하거나 회원자격을 상실시킬 수 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 타인의 정보를 도용하거나 허위 정보를 등록하는 행위
          </Text>
          <Text style={styles.item}>
            · 서비스를 이용하여 법령 또는 공서양속에 위반되는 행위
          </Text>
          <Text style={styles.item}>
            · 다른 이용자의 서비스 이용을 방해하거나 그 정보를 부정하게 사용하는
            행위
          </Text>
          <Text style={styles.item}>
            · QR코드를 통해 취득한 개인정보를 본래 목적(차량 이동 요청) 외의
            용도로 사용하는 행위
          </Text>
          <Text style={styles.item}>
            · 서비스의 안정적 운영을 방해하는 행위
          </Text>
        </View>

        <Text style={styles.title}>제7조 (이용자의 의무)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 이용자는 본 약관 및 관련 법령을 준수하여야 합니다.
          </Text>
          <Text style={styles.item}>
            · 이용자는 QR코드 스캔을 통해 취득한 타인의 연락처를 차량 이동 요청
            목적으로만 사용하여야 하며, 이를 저장, 유출, 또는 다른 목적으로
            이용하여서는 안 됩니다.
          </Text>
          <Text style={styles.item}>
            · 이용자는 서비스 이용 시 타인의 권리를 침해하거나 불편을 초래하는
            행위를 하여서는 안 됩니다.
          </Text>
        </View>

        <Text style={styles.title}>제8조 (회사의 의무)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회사는 관련 법령과 본 약관이 금지하거나 미풍양속에 반하는 행위를
            하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을
            다합니다.
          </Text>
          <Text style={styles.item}>
            · 회사는 이용자의 개인정보를 보호하기 위해 「개인정보 보호법」 등
            관련 법령이 정하는 바를 준수합니다.
          </Text>
        </View>

        <Text style={styles.title}>제9조 (서비스의 중단)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회사는 천재지변, 시스템 장애, 기타 불가항력적 사유가 발생한 경우
            서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.
          </Text>
          <Text style={styles.item}>
            · 회사는 서비스 중단 시 사전에 공지하며, 불가피한 경우 사후에 공지할
            수 있습니다.
          </Text>
        </View>

        <Text style={styles.title}>제10조 (면책조항)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
            제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </Text>
          <Text style={styles.item}>
            · 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을
            지지 않습니다.
          </Text>
          <Text style={styles.item}>
            · 회사는 이용자가 QR코드 스캔을 통해 취득한 연락처를 부정하게
            사용하여 발생한 분쟁에 대해 책임을 지지 않습니다.
          </Text>
        </View>

        <Text style={styles.title}>제11조 (회원 탈퇴 및 자격 상실)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회원은 앱 내 설정 메뉴를 통하여 언제든지 탈퇴를 요청할 수 있으며,
            회사는 즉시 회원 탈퇴를 처리합니다.
          </Text>
          <Text style={styles.item}>
            · 탈퇴 시 회원의 개인정보 및 QR코드는 즉시 삭제되며, 복구가
            불가능합니다.
          </Text>
        </View>

        <Text style={styles.title}>제12조 (분쟁해결)</Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회사와 이용자 간에 발생한 분쟁에 관하여는 대한민국 법을
            적용합니다.
          </Text>
          <Text style={styles.item}>
            · 서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기되는 경우,
            회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.
          </Text>
        </View>
      </View>
    </View>
  )
}
