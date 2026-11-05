import { ChangeType, VersionBump } from '@/domain/app'

// 버전 단위 이름
export const BUMP_LABEL: Record<VersionBump, string> = {
  major: '메이저',
  minor: '마이너',
  patch: '패치',
}

// 바뀐 내용 종류 이름
export const CHANGE_LABEL: Record<ChangeType, string> = {
  feature: '새 기능',
  improve: '개선',
  fix: '수정',
}
