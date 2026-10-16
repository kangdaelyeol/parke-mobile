import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PressableButton } from '@/components'
import { useDriveViewModel } from '@/screens/drive/view-model'
import { DocType } from '@/types/common'
import {
  BLUE_PRIMARY,
  DARK,
  DARK_LIGHT,
  GRAY,
  GRAY_DEEP,
  GRAY_LIGHT,
  WHITE,
} from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'

type DriveConsentProps = Pick<
  ReturnType<typeof useDriveViewModel>,
  'state' | 'actions'
>

const DOCS: { type: DocType; label: string }[] = [
  { type: 'location-terms', label: '위치기반서비스 이용약관' },
  { type: 'location-consent', label: '개인위치정보 수집·이용 동의' },
]

// 위치 동의가 없는 사용자가 주행 모드에 처음 들어왔을 때
export const DriveConsent = ({ state, actions }: DriveConsentProps) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingBottom: bottom + 16 }]}>
      <Text style={styles.title}>위치정보 이용 동의가 필요해요</Text>
      <Text style={styles.description}>
        주행 모드는 운행일지를 위해 이동 경로와 주행 거리를 기록합니다. 주행
        중에는 화면이 꺼져 있어도 주행을 끝낼 때까지 위치정보를 수집합니다.
      </Text>
      <View style={styles.docList}>
        {DOCS.map(doc => (
          <Pressable
            key={doc.type}
            style={styles.docRow}
            onPress={() => actions.showDocPress(doc.type)}
          >
            <View style={styles.optionalBox}>
              <Text style={styles.optionalText}>선택</Text>
            </View>
            <Text style={styles.docLabel}>{doc.label}</Text>
            <Text style={styles.docShow}>보기</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <PressableButton
          title="취소"
          onPress={actions.donePress}
          background={[DARK, DARK_LIGHT]}
          border={[DARK_LIGHT, GRAY_DEEP]}
          text={[WHITE, WHITE]}
          pressableStyle={styles.cancelButton}
        />
        <PressableButton
          title={state.agreeing ? '처리 중…' : '동의하고 주행 시작'}
          onPress={actions.agreeLocationPress}
          background={[BLUE_PRIMARY, '#1732ff']}
          text={[WHITE, WHITE]}
          pressableStyle={styles.agreeButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: DARK_LIGHT,
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 16,
  },
  title: {
    color: WHITE,
    fontFamily: DM_SANS.BOLD,
    fontSize: 20,
  },
  description: {
    color: GRAY_LIGHT,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 14,
    lineHeight: 21,
  },
  docList: {
    gap: 12,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionalBox: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: '#ffffff14',
    borderRadius: 3,
  },
  optionalText: {
    color: GRAY_LIGHT,
    fontSize: 12,
  },
  docLabel: {
    flex: 1,
    color: GRAY_LIGHT,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  docShow: {
    color: GRAY,
    fontFamily: DM_SANS.BOLD,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  agreeButton: {
    flex: 2,
  },
})
