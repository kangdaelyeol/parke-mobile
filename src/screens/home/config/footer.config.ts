// 아래 탭바 항목. tab: 탭바를 유지한 채 바뀌는 화면 / 아니면 탭바 위로 새 화면을 띄운다
export const footerIconList = [
  {
    key: 'HomeTab',
    label: '홈',
    iconName: 'house',
    tab: true,
  },
  {
    key: 'Profile',
    label: 'My',
    iconName: 'user',
    tab: true,
  },
  {
    key: 'SearchBLE',
    label: 'Scan',
    iconName: 'qrcode',
    tab: false,
  },
  {
    key: 'Setting',
    label: '설정',
    iconName: 'gear',
    tab: true,
  },
] as const
