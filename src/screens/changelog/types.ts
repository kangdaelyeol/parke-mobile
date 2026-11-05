import { ChangelogEntry } from '@/domain/app'
import { ViewModel } from '@/types/common'

interface ChangelogState {
  // 새 버전이 맨 위
  entries: ChangelogEntry[]
  // 앱의 현재 버전과 단계 (예: 1.3.0, Beta)
  version: string
  stage: string
}

interface ChangelogActions {
  backPress: () => void
}

export type ChangelogViewModel = ViewModel<ChangelogState, ChangelogActions>
