import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { CheckBoxLine } from '@/components'
import { useConsentViewModel } from '@setting/view-model'
import { ConsentItem } from '@setting/types'
import { DARK, DARK_LIGHT, GRAY, GRAY_DEEP } from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { formatDateTime } from '@/utils'
import { CONTENT_MAX_WIDTH } from '@/theme/layout'

// 선택 동의 관리 본문 (기본 테마: 처음 디자인)
export const ClassicConsentMain = () => {
  const { state, actions } = useConsentViewModel()

  const renderItem = (item: ConsentItem, required: boolean) => {
    const { docType } = item
    return (
      <View key={item.key} style={styles.item}>
        <CheckBoxLine
          confirm={item.agreed}
          confirmPress={() => docType && actions.togglePress(docType)}
          label={item.label}
          required={required}
          optional={!required}
          disabled={required || !!state.updating}
          docPress={docType ? () => actions.docPress(docType) : undefined}
        />
        <Text style={styles.statusText}>
          {state.updating === item.key
            ? '처리 중…'
            : item.agreedAt
            ? `${formatDateTime(item.agreedAt)} 동의${
                item.outdated ? ' · 개정 전 약관' : ''
              }`
            : '동의하지 않음'}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>선택 동의</Text>
          <View style={styles.card}>
            {state.optionalItems.map(item => renderItem(item, false))}
          </View>
          <Text style={styles.notice}>
            체크하면 동의, 체크를 해제하면 철회됩니다. 두 항목 모두 동의해야
            주행 모드(운행일지)를 사용할 수 있으며, 동의하지 않아도 다른 기능은
            그대로 사용할 수 있습니다.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>필수 동의</Text>
          <View style={styles.card}>
            {state.requiredItems.map(item => renderItem(item, true))}
          </View>
          <Text style={styles.notice}>
            필수 항목은 서비스 이용에 꼭 필요해 개별로 철회할 수 없습니다.
            철회를 원하시면 프로필에서 회원 탈퇴를 이용해주세요.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    paddingHorizontal: 10,
    paddingBottom: 80,
    marginHorizontal: 'auto',
  },
  section: {
    marginTop: 40,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 15,
  },
  card: {
    marginTop: 15,
    padding: 16,
    gap: 18,
    backgroundColor: DARK,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: DARK_LIGHT,
  },
  item: {
    gap: 6,
  },
  statusText: {
    marginLeft: 35,
    color: GRAY_DEEP,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  notice: {
    marginTop: 12,
    paddingHorizontal: 4,
    color: GRAY_DEEP,
    fontFamily: DM_SANS.MEDIUM,
    fontSize: 12,
    lineHeight: 18,
  },
})
