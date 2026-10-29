import { useState } from 'react'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { LOCATION_CONSENT_DOCS, REQUIRED_CONSENT_DOCS } from '@/constants'
import { useUserContext } from '@/contexts'
import { ConsentSettingStackNavigationProp } from '@/navigation/types'
import {
  driveSessionService,
  legalService,
  locationLogService,
} from '@/services'
import { ConsentKey, DocType } from '@/types/common'
import { ConsentItem, SettingConsentViewModel } from '@setting/types'

const CONSENT_LABELS: Record<ConsentKey, string> = {
  privacy: '개인정보 처리방침',
  age: '만 14세 이상 확인',
  terms: '서비스 이용약관 동의',
  consent: '개인정보 수집·이용 동의',
  'consent-third': '개인정보 제3자 제공 동의',
  location: '위치기반서비스 이용약관 동의',
  'location-consent': '개인위치정보 수집·이용 동의',
}

// 선택 동의(위치정보)는 항목별로 언제든 동의·철회할 수 있다.
// 필수 동의는 철회할 수 없고 회원 탈퇴로만 끝난다
export const useConsentViewModel = (): SettingConsentViewModel => {
  const { user, actions: userContextActions } = useUserContext()
  const [updating, setUpdating] = useState<DocType | null>(null)
  const navigation = useNavigation<ConsentSettingStackNavigationProp>()

  // 필수 동의는 개정 전 문서에 동의했어도 체크로 보여준다.
  // 선택 동의는 현재 문서에 동의해야만 유효(주행 모드 사용 조건)라 체크를 해제해 보여준다
  const toItem = (key: ConsentKey, required: boolean): ConsentItem => {
    const record = user?.consents?.[key]
    const agreed = !!record?.agreed
    const current =
      key === 'age' ? agreed : !legalService.needsReconsent(record)
    return {
      key,
      docType: key === 'age' ? null : key,
      label: CONSENT_LABELS[key],
      agreed: required ? agreed : current,
      agreedAt: agreed && record ? record.agreedAt : null,
      outdated: agreed && !current,
    }
  }

  const record = async (docType: DocType, agreed: boolean) => {
    if (!user) return false
    setUpdating(docType)
    const res = await legalService.recordConsents(user.id, [docType], agreed)
    setUpdating(null)
    if (!res.status) {
      Alert.alert(res.message)
      return false
    }
    userContextActions.setConsents(res.payload)
    return true
  }

  const agree = ({ docType, label }: ConsentItem) =>
    Alert.alert(
      '동의',
      `${label}에 동의할까요?\n\n위치정보 동의 2개에 모두 동의하면 주행 모드(운행일지)를 사용할 수 있습니다. 주행 중에는 화면이 꺼져 있어도 주행을 끝낼 때까지 위치정보를 수집합니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '문서 보기',
          onPress: () =>
            docType && navigation.navigate('LegalDoc', { docType }),
        },
        { text: '동의', onPress: () => docType && record(docType, true) },
      ],
    )

  const withdraw = ({ docType, label }: ConsentItem) =>
    Alert.alert(
      '동의 철회',
      `${label}을(를) 철회할까요?\n\n철회하면 주행 모드(운행일지)를 사용할 수 없고, 진행 중인 주행은 바로 종료됩니다. 저장된 주행 기록과 위치정보 수집·이용·제공사실 확인자료도 함께 삭제됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '철회',
          style: 'destructive',
          onPress: async () => {
            // 진행 중인 주행이 있으면 즉시 종료 (위치 수집 중단)
            driveSessionService.requestEnd()
            if (!docType || !(await record(docType, false))) return
            // 철회 시 주행 기록·확인자료 즉시 파기
            const res = await locationLogService.deleteMine()
            if (!res.status) {
              Alert.alert(
                '확인자료 삭제 실패',
                `동의는 철회되었지만 위치정보 기록을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.\n(${res.message})`,
              )
            }
          },
        },
      ],
    )

  const optionalItems = LOCATION_CONSENT_DOCS.map(key => toItem(key, false))

  return {
    state: {
      requiredItems: (['age', ...REQUIRED_CONSENT_DOCS] as const).map(key =>
        toItem(key, true),
      ),
      optionalItems,
      updating,
    },
    actions: {
      togglePress: docType => {
        const item = optionalItems.find(i => i.key === docType)
        if (!item || updating) return
        if (item.agreed) withdraw(item)
        else agree(item)
      },
      docPress: docType => navigation.navigate('LegalDoc', { docType }),
    },
  }
}
