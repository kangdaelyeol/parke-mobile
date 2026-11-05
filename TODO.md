# TODO

개발자가 직접 해야 하는 작업 목록입니다. 코드로 처리할 수 있는 작업은 포함하지 않았습니다.

## 1. 커밋 · 빌드

- [O] 지금까지의 변경사항 커밋
  - [O] `patches/` 폴더 포함 (`npm install` 때 위치 라이브러리 패치가 자동 적용됨)
  - [O] `ios/DriveActivity/`, `ios/DriveShared/`, `ios/DriveBridge/` 포함
- [O] iOS 재빌드 (`npm run ios`)
- [ ] Android 재빌드 (`npm run android`)
  - [ ] 예전 패키지 앱 삭제: `adb uninstall com.parke`, `adb uninstall com.originals.parke`
- [ ] 코드를 고쳤는데 화면에 반영되지 않으면 `npm start -- --reset-cache`
- [ ] 출시 전 홈 헤더의 [임시] "주행 테스트" 버튼 제거 (`SHOW_DRIVE_TEST_BUTTON`, 기본 테마 `header.tsx` · 글래스 `glass-top-bar.tsx`의 자동차 버튼)
- [ ] 출시 전 설정 → 테마의 [개발용] "구성 요소 보기" 끄기 (`SHOW_THEME_GALLERY = false`, `src/constants.ts`)
- [ ] 버전 관리: 기능 단위로 커밋할 때마다 `src/domain/app/changelog.ts` 맨 위에 항목을 더하고 버전을 올린다 (메이저 x.0.0 / 마이너 1.x.0 새 기능 / 패치 1.2.x 수정·다듬기). 커밋 메시지 끝에도 `(v1.3.0)`처럼 같은 버전을 적는다
- [ ] 스토어 출시 때 네이티브 버전을 앱 버전에 맞추기: iOS `MARKETING_VERSION`(지금 1.0.7) · Android `versionName`(지금 1.0)을 `APP_VERSION`과 같게 (빌드 번호 `CURRENT_PROJECT_VERSION` · `versionCode`는 올리기만)

## 2. 외부 콘솔 설정

### 카카오 개발자 콘솔

- [ ] 플랫폼 → Android에 패키지명 `com.originalshq.parke`, 키 해시 `Xo8WBi6jzSxKDVR4drqm84yr9iU=` 등록
- [ ] JavaScript 키 → JavaScript SDK 도메인에 `https://localhost` 추가 (기존 `http://localhost`는 삭제 가능)
- [ ] 제품 설정 → 카카오맵 사용 설정 ON 확인

### Firebase

- [ ] Android 앱 `com.originalshq.parke` 등록
- [ ] 위 앱에 디지털 지문(SHA-1) 등록: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
- [ ] `google-services.json` 다시 받아 `android/app/`에 덮어쓰기
- [ ] 예전 Android 앱 `com.originals.parke` 삭제
- [ ] Authentication → 로그인 방법에서 Google 사용 설정 확인
- [O] DB 규칙은 이제 `backend/database.rules.json`에서 관리 → `cd backend && firebase deploy --only database` (콘솔에서 직접 고치면 다음 배포 때 덮어씌워짐)
- [O] Realtime Database 보안 규칙 1단계 적용 (`allow` 쓰기 차단, 개별 읽기만 허용, 카드 필드 검증)
  - [ ] 출시 전 카드 필드 검증 다시 추가 (개발 중 느슨하게 바꾸며 제거함, 이전 규칙: `backend/database.rules.prev.json`) + `layout` 추가: `"layout": { ".validate": "newData.val() === 'a' || newData.val() === 'b' || newData.val() === 'c' || newData.val() === 'd'" }`

### Google Cloud (OAuth 동의 화면)

- [ ] 테스트 중에는 테스트 사용자에 테스트 계정 추가
- [ ] 출시 직전 "프로덕션으로 게시"

### Xcode

- [ ] DriveActivityExtension 타깃 → Signing & Capabilities의 Team이 앱과 같은지 확인

### 출시 준비 (Google 개발자 계정 승인 후)

- [ ] 릴리스 키스토어 생성 (`android/app/build.gradle`의 release가 지금은 debug 키로 서명됨)
- [ ] Play Console 앱 서명 키의 SHA-1 → Firebase에 추가, 카카오용 키 해시로 변환해 등록
- [ ] 릴리스 키스토어의 SHA-1 / 키 해시도 같은 방식으로 등록

### 운행 기록 이메일 (Firebase Functions)

자세한 명령어는 `backend/README.md` 참고

- [O] Firebase 요금제를 **Blaze(종량제)**로 변경 (Functions 사용 조건, 이 사용량이면 대부분 무료 한도 안)
- [O] 메일 발송 서비스 가입 (추천: Resend)
- [O] 보내는 도메인 인증: Resend에서 `originalshq.com` 추가 → 안내하는 DNS 레코드(SPF/DKIM 등)를 도메인 DNS(Squarespace 또는 Google Cloud DNS)에 등록
- [O] API 키 발급 후 `firebase functions:secrets:set SMTP_PASS`
- [O] `cd backend && firebase deploy --only functions`
- [O] 주행모드 요약 → [이메일로 보내기]로 실제 수신 확인 (스팸함도 확인)
- [O] DB 보안 규칙에 `reportQuota`, `locationLog`는 앱에서 읽기·쓰기 금지 (서버만 사용, 기본 거부 규칙이면 추가 작업 없음)
- [O] **앱 출시 전에 함수 먼저 배포** (카드 삭제·회원 탈퇴·위치정보 철회가 서버 함수를 부르도록 바뀜. 배포 전 앱에서는 이 기능들이 실패함)
- [ ] 배포 후 Google Cloud 콘솔 → Cloud Scheduler에 `purgeExpiredLocationLogs` 작업이 생겼는지 확인
- [O] 확인: 주행 시작/종료 → DB `locationLog/{uid}`에 `collect_start`/`collect_end`, 이메일 발송 → `provide` 기록
- [ ] 확인: 설정 → 위치정보 동의 철회 → `locationLog/{uid}` 삭제
- [ ] 확인: 공동 소유 카드에서 번호 주인이 카드 삭제 → 카드 번호가 남은 소유자 번호로 바뀜
- [ ] 확인: 회원 탈퇴 → `user/{uid}`, `drive/{uid}`, `drivePath/{uid}`, `reportQuota/{uid}`, `locationLog/{uid}`, Authentication 사용자 모두 삭제
- [ ] 주행 기록 저장 기능 배포 (앱 출시 전)
  - [O] DB 보안 규칙에 `drive`, `drivePath` 본인만 읽기·쓰기 추가 (`backend/database.rules.json`)
  - [ ] 함수 재배포 (철회·탈퇴 때 주행 기록도 삭제): `firebase deploy --only functions:deleteLocationData,functions:deleteAccount`
  - [ ] 확인: 주행 종료 → 카드 바텀시트 [주행 기록 보기] 목록 → 상세 지도·요약 → [기록 삭제]
  - [ ] 확인: 위치정보 동의 철회 → `drive/{uid}`, `drivePath/{uid}` 삭제
- [ ] `backend/functions/.env.parke-42fac` 커밋 (SMTP 주소 등 공개돼도 되는 설정값. 비밀번호는 시크릿에 따로 있음)

## 3. 실기기 테스트

### 주행모드 (야외에서)

- [O] 위치 권한 요청 → 지도 표시 → 경로가 카드 강조색으로 그려짐
- [O] 거리, 현재·평균 속도, 주행 시간이 갱신됨
- [O] 주행 중 화면이 저절로 꺼지지 않음
- [O] 화면을 끄고 이동한 뒤 켰을 때 경로가 이어져 있음
- [O] 건물에 들어가면 "GPS 신호 약함" 표시
- [O] iOS: 잠금화면 Live Activity 표시, 5초마다 거리 갱신, [주행 종료] → 앱을 열면 요약 화면
- [O] iOS: 설정 → parke → 실시간 현황이 켜져 있어야 표시됨
- [ ] Android: 상시 알림 표시 및 갱신, 잠금화면 [주행 종료] 동작
- [ ] 위치 미동의 계정으로 주행모드 진입 → 동의 패널 → 동의 후 주행 시작

### 그 외 기능

- [O] 구글 로그인 (첫 가입 → 초기설정, 재로그인 → 홈, 자동 로그인, 로그아웃)
- [ ] Android 카카오 로그인 (새 패키지명 등록 후)
- [O] 로그인 동의: 필수 4개만으로 로그인 가능, 위치 선택 동의 시 DB에 동의 시각 기록
- [ ] 설정 → 위치정보 동의 철회(선택 동의 관리 화면): 위치 동의 체크 → 동의 기록, 해제 → 철회 기록 + `locationLog/{uid}` 삭제, 필수 항목은 누를 수 없음
- [ ] 기존 계정 동의 기록 이동: 앱을 열면 `user/{uid}`의 `...AgreedAt` 필드가 `consents/` 아래로 옮겨짐 (1개 계정 확인, 나머지는 각 사용자가 앱을 열 때 이동)
- [ ] 카드 수정: 테마 / 강조 색상 / 크기 배율 저장
- [ ] 기기 등록: 이미 등록된 기기면 기존 카드 정보가 채워짐
- [ ] 번호 변경 확인 (자동변경 끈 상태): 요청이 한 번만 오는지, 본문 탭 시 앱 안에서 다시 묻는지, 카드 2장일 때 다른 카드 요청이 유지되는지
- [ ] 홈 → 설정/프로필 이동 중에도 "스캔 켜짐" 유지, 기기 등록 검색 후 백그라운드 스캔 재개
- [ ] 버그 수정 기간에 생겼을 수 있는 잘못된 DB 노드 정리: `card` 아래 기기 ID(8자리)를 키로 하고 `ownerList`, `title`이 없는 항목

## 4. 법률 · 문서

- [O] 개인정보처리방침 개정
  - [O] 수집 항목: 위치정보(위도·경도, 측정 시각, 속도, 정확도), 주행 기록(시각, 거리, 경로)
  - [O] 수집 시점: 주행 모드 사용 중, 앱이 백그라운드일 때 포함
  - [O] 이용 목적: 운행일지 작성, 주행 요약 제공
  - [O] 보관 기간 및 파기 (운행기록부 법정 보관 기간 확인)
  - [O] 외부 서비스: 카카오(로그인·지도), 구글(로그인), Firebase(저장)
  - [O] 위치정보관리책임자 성명·연락처
- [O] 서비스 이용약관에 운행일지 기능, GPS 오차 면책 문구 추가
- [ ] 위치 약관 법률 검토 (웹 문서 `originalshq.com/parke/location`, `/parke/location-consent`. 앱 내 약관 파일은 삭제됨)
- [O] 위치정보관리책임자 지정 (약관의 "(지정 예정)" 채우기)
- [ ] 방송통신위원회 위치기반서비스사업 신고 (문서에는 "방송미디어통신위원회"로 표기)
- [ ] 문서와 앱 표기 맞추기 (문서는 고치지 않고 보고만 한 항목)
  - [O] 위치 동의 철회 경로: 문서는 "앱 설정 → 위치정보 동의 철회" → 앱 설정 메뉴 이름을 "위치정보 동의 철회"로 맞춤
  - [ ] 회원 탈퇴 위치: 이용약관 제12조는 "앱 내 설정 메뉴", 처리방침 제8조와 앱은 "마이페이지(프로필) → 회원탈퇴"

## 5. 스토어 제출

### App Store

- [ ] 개인정보 라벨: 정확한 위치(앱 기능, 사용자와 연결됨), 이메일(로그인)
- [ ] 심사 메모: 백그라운드 위치 = "사용자가 시작한 주행 모드 중 운행 경로 기록", Live Activity 사용
- [ ] 주행 모드 시연 영상

### Google Play

- [ ] 데이터 보안: 위치(정확한 위치), 앱 기능 목적
- [ ] 포그라운드 서비스 권한 신고 (`FOREGROUND_SERVICE_LOCATION`) + 시연 영상

## 6. 주행 기록

### 구현한 것 (앱 · 서버)

- 저장 시점: 주행 모드 종료 → 요약 화면으로 넘어갈 때 자동 저장 (카드 없이 시작한 테스트 주행, 위치를 한 번도 받지 못한 주행은 저장 안 함)
- 저장 위치 (위치정보라 공개 노드 `card/`가 아닌 사용자별 노드)
  - 요약: `drive/{uid}/{cardId}/{driveId}` = `{ cardTitle, startAt, endAt, distance(m), averageSpeed(m/s), maxSpeed(m/s), createdAt }`
  - 경로: `drivePath/{uid}/{driveId}` = `[[위도, 경도], ...]` (최대 1000점, 소수점 6자리)
- 화면: 카드 바텀시트 [주행 기록 보기] → 목록(최근순) → 상세(경로 지도 + 요약) → [기록 삭제]
- 삭제
  - 사용자가 상세에서 기록 삭제 → 요약·경로 함께 삭제
  - 위치정보 동의 철회 → `drive/{uid}`, `drivePath/{uid}` 전체 삭제 (`deleteLocationData`)
  - 회원 탈퇴 → 같이 삭제 (`deleteAccount`)
  - **카드 삭제(연결 해제) → 남겨 둠** (문서상 보유 기간 "이용자가 삭제하거나 회원 탈퇴 시까지")
- 재등록 시 다시 연결: 카드 ID = 제품 시리얼(`allow/{serial}`의 키)이라, 같은 사용자가 같은 제품을 다시 등록하면 `drive/{uid}/{시리얼}`의 기록이 그대로 다시 보인다 (앱 추가 작업 없음)
- 다른 사람이 같은 제품을 등록해도 기록은 이전 사용자 `uid` 아래에 있어 보이지 않는다
- 이메일 (유저·카드 따로 저장)
  - 내 이메일: `user/{uid}/email` → 프로필에서 닉네임·연락처와 함께 저장
  - 카드 이메일: `cardPrivate/{cardId}/email` → 카드 수정 화면에서 저장, 공동 소유자끼리 공유
    - 공개 노드 `card/`에 두면 카드 ID만 알면 누구나 읽을 수 있어 분리. DB 규칙으로 그 카드 소유자(`ownerList` 앞 10명)만 읽기·쓰기
  - 주행 요약 [이메일로 보내기] 미리 채움 순서: 카드 이메일 → 내 이메일 → 이 기기에서 최근 보낸 주소 (창에서 바꿔 보내도 저장된 주소는 그대로)
  - 입력 형식: [아이디] @ [도메인 선택 / 직접 입력] (`src/components/email-domain-input.tsx`, 반투명 유리 스타일 시험 적용)
  - 삭제: 카드의 마지막 소유자가 빠지면 카드와 함께 삭제(`leaveCard`), 회원 탈퇴 시 `user/{uid}`와 함께 삭제
- [O] 배포: `cd backend && firebase deploy --only database,functions:leaveCard,functions:deleteAccount` (`cardPrivate` 규칙 + 카드 삭제 시 이메일 정리)
- [ ] 확인: 프로필 이메일 저장 → 카드 이메일 없는 카드로 주행 → 보내기 창에 내 이메일이 채워짐
- [ ] 확인: 카드 수정 → 카드 이메일 저장 → 주행 종료 → 보내기 창에 카드 이메일이 채워짐 → 다른 주소로 바꿔 보내기
- [ ] 개발 중 남은 데이터 정리(선택): `user/{uid}/reportEmails` (이전 설계, 지금은 안 씀)
- [ ] 문서 확인(문서는 고치지 않음): 카드 이메일은 공동 소유자에게 보임 → 처리방침 제5조 제3자 제공 항목에 공동 소유자가 없음. 연락처(카드 번호)와 같은 취급인지 검토

### admin 프론트(카드 초기화) 작업 시 AI에게 전달할 내용

- [ ] 아래 내용을 admin 프론트 AI에게 전달
- [ ] 카드 초기화용 서버 함수 구현 요청 (아래 3번 때문에 admin 화면에서 직접 처리할 수 없음)

```text
[Parké 카드 초기화 기능 – 변경사항]

배경
- 앱이 주행 기록을 사용자별로 저장한다.
  - drive/{uid}/{cardId}/{driveId}   (요약)
  - drivePath/{uid}/{driveId}        (경로)
- cardId = 제품 시리얼 = allow/{serial}의 키. 같은 사용자가 같은 제품을 다시 등록하면 기존 주행 기록이 다시 보인다.

카드 초기화 시 지켜야 할 것
1. drive, drivePath, user/{uid}/email은 읽지도, 수정하지도, 삭제하지도 않는다.
   - 사용자 소유 위치정보이며 DB 규칙상 본인만 접근할 수 있다(관리자도 접근 불가가 정상).
2. 카드 초기화 = card/{cardId} 삭제 + cardPrivate/{cardId}(카드 이메일) 삭제 + 그 카드 소유자(card/{cardId}/ownerList)의
   user/{uid}/cardIdList에서 cardId 제거. 이 둘은 반드시 함께 처리한다.
   - cardIdList에 없는 카드 ID가 남아 있으면 앱의 카드 목록 불러오기가 통째로 실패한다
     ("카드 정보를 불러오는데 실패했습니다").
3. DB 규칙상 관리자는 user/{uid}에 쓸 수 없으므로 브라우저에서 직접 처리하지 않는다.
   - 서버 함수(Callable, asia-northeast3, 예: adminResetCard({ cardId }))를 호출만 한다.
   - 함수는 관리자 여부(admin/{이메일키})를 서버에서 확인한다.
4. allow/{serial}은 유지한다. 초기화 후에도 같은 제품을 다시 등록할 수 있어야 한다.
   (제품 자체를 폐기할 때만 기존 삭제 기능 + adminLog/deletions 사용)
5. 초기화 확인 화면에 안내: "이 카드의 주행 기록은 각 사용자 계정에 남아 있으며,
   같은 사용자가 이 제품을 다시 등록하면 다시 보입니다."
6. 초기화 기록을 남긴다(예: adminLog/resets/{logId} = { serial, resetAt, resetBy }).
   - 새 경로라 DB 규칙 추가가 필요하다.

참고: card/{cardId} 스키마
{ id, title, phone, theme('dark'|'light'|'amber'|'mint'), layout('a'|'b'|'c'|'d'),
  custom{ accent('#RRGGBB'), scale(0.85~1.3), message(≤40자) }, updatedAt, deviceId, ownerList[uid] }
```

## 7. 결정이 필요한 것

- [ ] 번호 변경 "동시 접속" 판정 기준 (예: 1분 안에 둘 다 감지되면 동시, "아니오"는 카드별 30분)
- [ ] 이미 등록된 기기를 공동 사용자로 등록할 때 전화번호 기본값: 기존 카드 번호 / 내 번호
- [ ] 운행일지
  - [ ] 동승자 폰도 감지될 때 처리 (나중에 시작한 사람은 동승자로 처리할지)
  - [ ] 이메일 발송 단위: 운행마다 / 월간 운행기록부만
  - [ ] 계기판 주행거리 입력 방식 (국세청 양식용)
  - [ ] 기기 펌웨어가 운행 중 BLE 연결을 계속 유지할 수 있는지 확인
- [ ] 서버(Firebase Functions) 도입 시점: 카카오 로그인 커스텀 토큰 전환, 카드 등록 서버 처리 (삭제·탈퇴는 서버로 옮김)
- [ ] 개정 약관 재동의: 개정 전 약관에 동의한 기존 사용자에게 공지만 할지, 앱 실행 시 다시 동의받을지 (지금은 재로그인 때만 새 시행일로 기록)
- [ ] 동의 기록 위조 방지: 지금은 사용자가 자기 `user/{uid}/consents`를 직접 쓸 수 있음 (서버 함수로 기록하도록 옮길지)
- [ ] 문자 발송(솔라피): 보낼 메시지 정하기 → API Key/Secret 시크릿 등록, 발신번호 등록, 충전
- [ ] DB 소유자 구조 변경(`ownerList` 배열 → 맵) 및 "소유자만 수정" 규칙 적용 시점
