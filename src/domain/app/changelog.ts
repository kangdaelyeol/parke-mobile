// 버전 올리는 단위
// - major: 크게 바뀌어 이전 버전과 맞지 않을 때 (x.0.0)
// - minor: 새 기능을 더했을 때 (1.x.0)
// - patch: 고치거나 다듬었을 때 (1.2.x)
export type VersionBump = 'major' | 'minor' | 'patch'

// 바뀐 내용 종류
export type ChangeType = 'feature' | 'improve' | 'fix'

export interface ChangelogEntry {
  version: string
  // YYYY-MM-DD
  date: string
  bump: VersionBump
  // 한 줄 요약
  title: string
  changes: { type: ChangeType; text: string }[]
}

/**
 * 변경 내역 (새 버전이 맨 위). 맨 위 항목이 앱의 현재 버전이다.
 * 기능 단위로 커밋할 때 여기에 항목을 하나 더하고 단위에 맞게 버전을 올린다.
 * 커밋 메시지 끝에도 같은 버전을 적는다 (예: "Feat: ... (v1.3.0)")
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.3.0',
    date: '2026-11-05',
    bump: 'minor',
    title: '버전 정보와 변경 내역',
    changes: [
      {
        type: 'feature',
        text: '설정의 현재 버전을 누르면 버전마다 무엇이 바뀌었는지 볼 수 있어요.',
      },
    ],
  },
  {
    version: '1.2.1',
    date: '2026-11-05',
    bump: 'patch',
    title: '글래스 대시보드 카드 크기 맞춤',
    changes: [
      {
        type: 'improve',
        text: '글래스 대시보드에서 내 기기 카드 폭을 위의 오늘의 현황과 같게 맞췄어요. 큰 화면에서는 카드가 조금 커져요.',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-11-05',
    bump: 'minor',
    title: '테마 선택',
    changes: [
      {
        type: 'feature',
        text: '설정 → 테마에서 「기본」과 「글래스 대시보드」 중에 고를 수 있어요. 기본 테마는 처음 디자인이에요.',
      },
      {
        type: 'improve',
        text: '글래스 대시보드의 강조색을 기본 테마와 같은 파란색으로 바꿨어요.',
      },
      {
        type: 'improve',
        text: '글래스 대시보드에서 제목이 모두 유리 판 안에 들어가도록 홈·설정·선택 동의·카드 수정 화면을 정리했어요.',
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-11-05',
    bump: 'minor',
    title: '하단 탭과 글래스 디자인',
    changes: [
      {
        type: 'feature',
        text: '아래 탭바로 홈 · My · 설정을 화면 전환 없이 바로 오갈 수 있어요.',
      },
      {
        type: 'feature',
        text: '유리 느낌의 새 디자인을 홈·My·설정·주행 기록에 입혔어요.',
      },
      {
        type: 'fix',
        text: '카드를 넘길 때 넘겨진 카드의 버튼까지 함께 눌리던 문제를 고쳤어요.',
      },
      {
        type: 'improve',
        text: '카드 상세를 열어 둔 채 카드를 넘기면 상세가 자동으로 접혀요.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-11-03',
    bump: 'major',
    title: '첫 베타',
    changes: [
      {
        type: 'feature',
        text: '블루투스로 Parké 기기를 찾아 카드를 등록하고, QR을 스캔한 사람에게 보이는 카드 화면을 꾸밀 수 있어요.',
      },
      {
        type: 'feature',
        text: '기기가 감지되면 카드 번호를 내 번호로 바꿔 주는 자동변경과 알림.',
      },
      {
        type: 'feature',
        text: '주행 모드(운행일지)로 주행 기록을 남기고, 지도와 함께 다시 보거나 이메일로 받을 수 있어요.',
      },
      {
        type: 'feature',
        text: '위치정보 동의 관리와 회원탈퇴.',
      },
    ],
  },
]

// 앱의 현재 버전 (변경 내역 맨 위)
export const APP_VERSION = CHANGELOG[0].version
// 출시 전 단계 표시
export const APP_STAGE = 'Beta'
