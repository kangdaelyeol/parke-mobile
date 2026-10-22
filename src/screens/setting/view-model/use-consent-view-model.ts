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
import { DocType } from '@/types/common'
import { ConsentItem, SettingConsentViewModel } from '@setting/types'

const CONSENT_LABELS: Partial<Record<DocType, string>> = {
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

  const toItem = (docType: DocType): ConsentItem => {
    const record = user?.consents?.[docType]
    const agreed = !legalService.needsReconsent(record)
    return {
      docType,
      label: CONSENT_LABELS[docType] ?? '',
      agreed,
      agreedAt: agreed && record ? record.agreedAt : null,
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

  const agree = (item: ConsentItem) =>
    Alert.alert(
      '동의',
      `${item.label}에 동의할까요?\n\n위치정보 동의 2개에 모두 동의하면 주행 모드(운행일지)를 사용할 수 있습니다. 주행 중에는 화면이 꺼져 있어도 주행을 끝낼 때까지 위치정보를 수집합니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '문서 보기',
          onPress: () =>
            navigation.navigate('LegalDoc', { docType: item.docType }),
        },
        { text: '동의', onPress: () => record(item.docType, true) },
      ],
    )

  const withdraw = (item: ConsentItem) =>
    Alert.alert(
      '동의 철회',
      `${item.label}을(를) 철회할까요?\n\n철회하면 주행 모드(운행일지)를 사용할 수 없고, 진행 중인 주행은 바로 종료됩니다. 위치정보 수집·이용·제공사실 확인자료도 함께 삭제됩니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '철회',
          style: 'destructive',
          onPress: async () => {
            // 진행 중인 주행이 있으면 즉시 종료 (위치 수집 중단)
            driveSessionService.requestEnd()
            if (!(await record(item.docType, false))) return
            // 철회 시 확인자료 즉시 파기 (운행 기록은 서버에 저장하지 않음)
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

  const optionalItems = LOCATION_CONSENT_DOCS.map(toItem)

  return {
    state: {
      requiredItems: REQUIRED_CONSENT_DOCS.map(toItem),
      optionalItems,
      updating,
    },
    actions: {
      togglePress: docType => {
        const item = optionalItems.find(i => i.docType === docType)
        if (!item || updating) return
        if (item.agreed) withdraw(item)
        else agree(item)
      },
      docPress: docType => navigation.navigate('LegalDoc', { docType }),
    },
  }
}
