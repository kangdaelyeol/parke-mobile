import { Text, View } from 'react-native'
import { styles } from './term-style'

export const Privacy = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.mainTitle}>개인정보 처리방침</Text>
        <Text style={styles.paragraph}>
          (주)오리지널스(이하 "회사")는 「개인정보 보호법」 제30조에 따라
          정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
          처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
          수립·공개합니다.
        </Text>
        <Text style={styles.title}>제1조 (개인정보의 처리 목적)</Text>
        <Text style={styles.paragraph}>
          회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
          개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
          변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는
          등 필요한 조치를 이행할 예정입니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 회원 가입 및 관리: 회원 가입의사 확인, 본인 식별·인증, 회원자격
            유지·관리, 서비스 부정이용 방지
          </Text>
          <Text style={styles.item}>
            · 주차 QR코드 서비스 제공: QR코드 생성, 차량 이동 요청 시 차주 연락
            중개
          </Text>
          <Text style={styles.item}>
            · 고충 처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한
            연락·통지, 처리결과 통보
          </Text>
        </View>
        <Text style={styles.title}>제2조 (개인정보의 처리 및 보유 기간)</Text>
        <Text style={styles.paragraph}>
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
          개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를
          처리·보유합니다.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>처리목적</Text>
            <Text style={styles.tableHead}>수집 항목</Text>
            <Text style={styles.tableHead}>보유 기간</Text>
            <Text style={styles.tableHead}>근거</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>회원 가입 및 관리</Text>
            <Text style={styles.tableData}>닉네임, 이메일, 휴대전화번호</Text>
            <Text style={styles.tableData}>회원 탈퇴 시까지</Text>
            <Text style={styles.tableData}>정보주체 동의</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>주차 QR코드 서비스 </Text>
            <Text style={styles.tableData}>휴대전화번호</Text>
            <Text style={styles.tableData}>
              QR코드 삭제 또는 회원 탈퇴 시까지
            </Text>
            <Text style={styles.tableData}>정보주체 동의</Text>
          </View>
        </View>
        <Text style={styles.title}>제3조 (개인정보의 수집 방법)</Text>
        <Text style={styles.paragraph}>
          회사는 다음과 같은 방법으로 개인정보를 수집합니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 카카오 로그인을 통한 수집: 닉네임, 이메일 (카카오로부터 제공받음)
          </Text>
          <Text style={styles.item}>
            · 앱 내 직접 입력: 휴대전화번호, 차량번호
          </Text>
        </View>
        <Text style={styles.title}>제4조 (개인정보의 제3자 제공)</Text>
        <Text style={styles.paragraph}>
          회사는 정보주체의 개인정보를 개인정보의 처리 목적에서 명시한 범위
          내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보
          보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
          제공하고 그 이외에는 정보주체의 개인정보를 제3자에게 제공하지
          않습니다.
        </Text>
        <Text style={styles.paragraph}>
          다만, 다음의 경우에는 개인정보를 이용 및 제공할 수 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}> · 정보주체의 동의가 있는 경우</Text>
          <Text style={styles.item}> · 법률 규정 또는 법령 상 의무 준수</Text>
          <Text style={styles.item}> · 공공기관 소관업무 수행</Text>
          <Text style={styles.item}> · 급박한 생명・신체・재산상 이익</Text>
          <Text style={styles.item}>
            · 개인정보처리자의 명백히 정당한 이익 달성
          </Text>
          <Text style={styles.item}>
            · 공중위생 등 공공의 안전과 안녕을 위하여 긴급한 필요
          </Text>
        </View>
        <Text style={styles.paragraph}>
          회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한
          범위 내에서만 처리하며, 정보주체의 별도 동의가 있는 경우에 한하여
          제3자에게 개인정보를 제공합니다.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}> 제공받는 자 </Text>
            <Text style={styles.tableHead}> 제공 목적 </Text>
            <Text style={styles.tableHead}> 제공 항목 </Text>
            <Text style={styles.tableHead}> 보유 및 이용 기간</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>
              주차 QR코드를 스캔한 이용자 (차량 이동 요청자)
            </Text>
            <Text style={styles.tableData}>
              주차 차량 이동 요청을 위한 연락
            </Text>
            <Text style={styles.tableData}> 휴대전화번호 </Text>
            <Text style={styles.tableData}>
              연락 목적 달성 시 즉시 파기 (화면 표시 종료 시)
            </Text>
          </View>
        </View>
        <Text style={styles.paragraph}>
          ※ 제3자 제공에 대한 동의는 회원가입 시점에 별도로 받으며, 정보주체는
          제3자 제공 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하는 경우
          주차 QR코드 서비스 이용이 제한될 수 있습니다.
        </Text>
        <Text style={styles.title}>제5조 (개인정보처리의 위탁)</Text>
        <Text style={styles.paragraph}>
          회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
          처리업무를 위탁하고 있습니다.
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>수탁업체</Text>
            <Text style={styles.tableHead}>위탁 업무 내용</Text>
            <Text style={styles.tableHead}>보유 및 이용 기간</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableData}>카카오</Text>
            <Text style={styles.tableData}>카카오 로그인 연동 (본인 인증)</Text>
            <Text style={styles.tableData}>위탁계약 종료 시까지</Text>
          </View>
        </View>
        <Text style={styles.title}>
          제6조 (정보주체의 권리·의무 및 행사방법)
        </Text>
        <Text style={styles.paragraph}>
          정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를
          행사할 수 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}> · 개인정보 열람 요구</Text>
          <Text style={styles.item}> · 오류 등이 있을 경우 정정 요구</Text>
          <Text style={styles.item}> · 삭제 요구</Text>
          <Text style={styles.item}> · 처리정지 요구</Text>
        </View>
        <Text style={styles.paragraph}>
          요구 방법: 앱: 마이페이지 &rarr; 회원정보 수정
        </Text>
        <Text style={styles.paragraph}>
          회원이 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기
          전까지 당해 개인정보를 이용 또는 제3자에게 제공하지 않습니다. 또한,
          잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를
          제3자에게 지체 없이 통지하여 정정이 이루어 지도록 조치하겠습니다.
        </Text>
        <Text style={styles.paragraph}>
          회원이 개인정보에 대한 열람 및 제공을 요구할 경우, 10일 이내에
          회신하도록 하겠습니다.
        </Text>
        <Text style={styles.paragraph}>
          권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
          통하여 하실 수도 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시”
          [별지 11] 서식에 따른 위임장을 제출하셔야 합니다.
        </Text>
        <Text style={styles.paragraph}>
          회사는 정보주체 권리에 따른 열람의 요구, 정정・삭제의 요구, 처리정지의
          요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를
          확인합니다.
        </Text>
        <Text style={styles.paragraph}>
          회원은 회원가입 시 개인정보의 수집, 이용 및 제공에 대해 동의하신
          내용을 언제든지 철회 할 수 있으며, 회원탈퇴 시 회사는 지체 없이 회원의
          개인정보를 파기하는 등 필요한 조치를 하겠습니다
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}> · 앱: 마이페이지 &rarr; 회원탈퇴</Text>
        </View>
        <Text style={styles.paragraph}>
          정보주체가 개인정보 열람 및 처리 정지를 요구할 권리는 「개인정보
          보호법」 제35조제4항 및 제37조제2항에 의하여 제한될 수 있습니다.
        </Text>
        <Text style={styles.paragraph}>
          위 권리 행사는 앱 내 설정 메뉴를 통하여 하실 수 있으며, 회사는 이에
          대해 지체 없이 조치하겠습니다.
        </Text>
        <Text style={styles.title}>제7조 (개인정보의 파기)</Text>
        <Text style={styles.paragraph}>
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
          불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 전자적 파일 형태: 복구 및 재생이 불가능한 방법으로 영구 삭제
          </Text>
          <Text style={styles.item}>
            · 기록물, 인쇄물, 서면 등: 파쇄 또는 소각
          </Text>
        </View>

        <Text style={styles.title}>제8조 (개인정보의 안전성 확보 조치)</Text>
        <Text style={styles.paragraph}>
          회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
          있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 개인정보의 암호화: 이용자의 휴대전화번호 등 중요 개인정보는
            암호화되어 저장·관리됩니다.
          </Text>
          <Text style={styles.item}>
            · 접근 통제: 개인정보를 처리하는 데이터베이스시스템에 대한
            접근권한의 부여, 변경, 말소를 통하여 접근을 통제합니다.
          </Text>
          <Text style={styles.item}>
            · 접속기록의 보관: 개인정보 처리시스템에 접속한 기록을 최소 1년 이상
            보관·관리합니다.
          </Text>
        </View>

        <Text style={styles.title}>제9조 (개인정보 보호책임자)</Text>
        <Text style={styles.paragraph}>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
          관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
          개인정보 보호책임자를 지정하고 있습니다.
        </Text>
        <Text style={styles.paragraph}>개인정보 보호책임자</Text>
        <View style={styles.list}>
          <Text style={styles.item}> · 성명: 강대렬</Text>
          <Text style={styles.item}> · 직책: CTO</Text>
          <Text style={styles.item}>
            · 연락처: daniel@originalshq.com / 010-2413-0510
          </Text>
        </View>

        <Text style={styles.title}>제10조 (개인정보 처리방침의 변경)</Text>
        <Text style={styles.paragraph}>
          이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
          변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
          전부터 공지사항을 통하여 고지할 것입니다.
        </Text>

        <Text style={styles.title}>제11조 (권익침해 구제방법)</Text>
        <Text style={styles.paragraph}>
          정보주체는 개인정보침해로 인한 구제를 받기 위하여
          개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
          분쟁해결이나 상담 등을 신청할 수 있습니다.
        </Text>
        <View style={styles.list}>
          <Text style={styles.item}>
            · 개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)
          </Text>
          <Text style={styles.item}>
            · 개인정보침해신고센터: 118 (privacy.kisa.or.kr)
          </Text>
          <Text style={styles.item}> · 대검찰청: 1301 (www.spo.go.kr)</Text>
          <Text style={styles.item}> · 경찰청: 182 (ecrm.cyber.go.kr)</Text>
        </View>
      </View>
    </View>
  )
}
