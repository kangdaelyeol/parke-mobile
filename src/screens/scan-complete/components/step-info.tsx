import { StyleSheet, Text, View } from 'react-native'
import { FocusableInput } from '@/components'
import { useScanCompleteContext } from '@scan-complete/contexts'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GRAY, WHITE } from '@/theme/color'
import { formatPhone } from '@/utils'

// 2단계: 카드 정보를 입력한다. 이미 등록된 기기면 기존 정보가 채워져 있다.
export const StepInfo = () => {
  const { state, actions } = useScanCompleteContext()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {state.existingCard
          ? '등록된 정보를 확인해주세요'
          : '기본정보를 입력해주세요!'}
      </Text>
      {state.existingCard && (
        <Text style={styles.notice}>
          이미 등록된 기기입니다. 저장하면 공동 사용자로 추가됩니다.
        </Text>
      )}

      <FocusableInput
        title="Parke 이름"
        placeholder="Parke 이름"
        value={state.name}
        onChangeText={actions.nameInput}
        iconName="card"
      />
      <FocusableInput
        title="전화번호"
        placeholder="전화번호"
        value={formatPhone(state.phone)}
        onChangeText={actions.phoneInput}
        iconName="phone"
      />
      <FocusableInput
        title="메시지"
        placeholder="메시지"
        value={state.message}
        onChangeText={actions.messageInput}
        iconName="message"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 25,
    marginTop: 30,
  },
  notice: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
  },
})
