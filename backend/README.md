# Parké 백엔드 (Firebase Functions)

## 함수
| 이름 | 종류 | 설명 |
|---|---|---|
| `sendDriveReport` | Callable | 주행모드 요약을 운행 기록 보고서 이메일로 발송. 로그인 사용자만, 계정당 하루 20회. 발송 성공 시 제공 사실을 확인자료로 기록 |
| `logLocationAccess` | Callable | 주행 모드 위치 수집 시작/종료를 확인자료로 기록 |
| `deleteLocationData` | Callable | 위치정보 동의 철회 시 본인 확인자료 즉시 삭제 |
| `purgeExpiredLocationLogs` | Schedule (매일 04:00 KST) | 6개월(183일) 지난 확인자료, 지난 날짜의 발송 횟수 기록 삭제 |
| `leaveCard` | Callable | 카드(기기) 연결 해제. 남은 소유자가 없으면 카드 삭제, 카드 번호가 내 번호면 남은 소유자 번호로 교체 |
| `deleteAccount` | Callable | 회원 탈퇴. 모든 카드 연결 해제 + `user`·`reportQuota`·`locationLog` 삭제 + 로그인 계정 삭제 |

모든 함수는 `asia-northeast3` 리전, 로그인 사용자만 호출할 수 있다.

- 앱은 측정값과 요약 지도 이미지(JPEG)만 보내고, 메일 HTML은 서버가 만든다 (`src/report-template.ts`).
- 하루 발송 횟수는 Realtime Database `reportQuota/{uid}/{YYYY-MM-DD}`에 기록된다.
- 위치정보 수집·이용·제공사실 확인자료(위치정보법 제16조)는 `locationLog/{uid}/{pushId}` = `{ type, purpose, recipient?, at }`에 기록된다.
  - `type`: `collect_start` / `collect_end` / `provide`
  - 앱(클라이언트)은 이 경로를 읽거나 쓸 수 없어야 한다 (DB 규칙 기본 거부)
- 예약 함수(`purgeExpiredLocationLogs`)는 Cloud Scheduler를 쓰므로 Blaze 요금제가 필요하다.

## 처음 한 번
```bash
cd backend/functions
npm install
firebase login
firebase use parke-42fac
```

## 메일 발송 설정 (SMTP)
기본값은 Resend SMTP 기준이다. 다른 서비스를 쓰면 배포할 때 물어보는 값을 바꾸면 된다.

| 이름 | 기본값 | 설명 |
|---|---|---|
| `SMTP_HOST` | `smtp.resend.com` | SMTP 서버 |
| `SMTP_PORT` | `465` | 465면 SSL |
| `SMTP_USER` | `resend` | Resend는 고정값 `resend` |
| `MAIL_FROM` | `Parké <no-reply@originalshq.com>` | 보내는 사람 (인증된 도메인이어야 함) |
| `SMTP_PASS` | (시크릿) | Resend API 키 등 |

```bash
# 비밀번호(API 키)는 시크릿으로만 저장
firebase functions:secrets:set SMTP_PASS
```

## 배포
```bash
cd backend
firebase deploy --only functions
```
배포할 때 `SMTP_HOST` 등 값을 처음 한 번 물어보며, 답한 값은 `functions/.env.parke-42fac`에 저장된다.

## 로그
```bash
cd backend/functions
npm run logs
```
