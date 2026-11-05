import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { CheckBoxLine, GlassSurface, SectionLabel } from '@/components'
import { useConsentViewModel } from '@setting/view-model'
import { ConsentItem } from '@setting/types'
import { PRETENDARD } from '@/theme/fonts'
import { TEXT } from '@/theme/glass'
import { formatDateTime } from '@/utils'

export const ConsentMain = () => {
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
          <SectionLabel>선택 동의</SectionLabel>
          <GlassSurface style={styles.card}>
            {state.optionalItems.map(item => renderItem(item, false))}
          </GlassSurface>
          <Text style={styles.notice}>
            체크하면 동의, 체크를 해제하면 철회됩니다. 두 항목 모두 동의해야
            주행 모드(운행일지)를 사용할 수 있으며, 동의하지 않아도 다른 기능은
            그대로 사용할 수 있습니다.
          </Text>
        </View>
        <View style={styles.section}>
          <SectionLabel>필수 동의</SectionLabel>
          <GlassSurface style={styles.card}>
            {state.requiredItems.map(item => renderItem(item, true))}
          </GlassSurface>
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
    maxWidth: 400,
    paddingHorizontal: 14,
    paddingBottom: 80,
    marginHorizontal: 'auto',
  },
  section: {
    marginTop: 28,
  },
  card: {
    marginTop: 12,
    padding: 16,
    gap: 18,
    borderRadius: 18,
  },
  item: {
    gap: 6,
  },
  statusText: {
    marginLeft: 35,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
  },
  notice: {
    marginTop: 12,
    paddingHorizontal: 4,
    color: TEXT.tertiary,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 12,
    lineHeight: 18,
  },
})
