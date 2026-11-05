import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PressableButton } from '@/components'
import { getEmailSuggestions, isEmail } from '@/utils'
import { DriveEmailSheetProps } from '@/screens/drive/types'
import { GRAY, GRAY_DEEP, GRAY_LIGHT, WHITE } from '@/theme/color'
import { DM_SANS, PRETENDARD } from '@/theme/fonts'
import { GLASS, glassStyles } from '@/theme/glass'

// 운행 기록을 받을 이메일 입력. '@' 뒤 도메인은 목록에서 골라 완성할 수 있다
export const EmailReportSheet = ({
  visible,
  initialEmail,
  source,
  sending,
  onClose,
  onSend,
  onClearSaved,
}: DriveEmailSheetProps) => {
  const { bottom } = useSafeAreaInsets()
  const [email, setEmail] = useState(initialEmail)
  const [focused, setFocused] = useState(false)

  // 열 때마다 카드 이메일 → 내 이메일 → 최근 보낸 주소 순으로 채운다
  useEffect(() => {
    if (visible) setEmail(initialEmail)
  }, [visible, initialEmail])

  const suggestions = focused ? getEmailSuggestions(email) : []
  const valid = isEmail(email)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={styles.dismiss}
          onPress={sending ? undefined : onClose}
        />
        <View style={[styles.sheet, { paddingBottom: bottom + 16 }]}>
          <Text style={styles.title}>운행 기록 보내기</Text>
          <Text style={styles.description}>
            운행 정보와 이동 경로 지도를 보고서로 정리해 보내드려요.
          </Text>

          <View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="이메일 주소"
              placeholderTextColor={GRAY_DEEP}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={() => valid && onSend(email.trim())}
              editable={!sending}
              style={[
                glassStyles.field,
                styles.input,
                focused && glassStyles.fieldFocused,
              ]}
            />
            {suggestions.length > 0 && (
              <View style={[glassStyles.field, styles.suggestions]}>
                {suggestions.map(suggestion => {
                  const at = suggestion.indexOf('@')
                  return (
                    <Pressable
                      key={suggestion}
                      onPress={() => setEmail(suggestion)}
                    >
                      {({ pressed }) => (
                        <View
                          style={[
                            styles.suggestion,
                            pressed && glassStyles.pressed,
                          ]}
                        >
                          <Text
                            style={styles.suggestionLocal}
                            numberOfLines={1}
                          >
                            {suggestion.slice(0, at)}
                            <Text style={styles.suggestionDomain}>
                              {suggestion.slice(at)}
                            </Text>
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>

          {source !== 'recent' ? (
            <Text style={styles.cardEmailHint}>
              {source === 'card'
                ? '카드에 설정된 주소예요. 카드 수정에서 바꿀 수 있어요.'
                : '내 이메일이에요. 프로필에서 바꿀 수 있어요.'}
            </Text>
          ) : (
            !!initialEmail && (
              <Pressable
                hitSlop={8}
                disabled={sending}
                onPress={() => {
                  onClearSaved()
                  setEmail('')
                }}
              >
                <Text style={styles.clearSaved}>
                  저장된 주소 삭제 ({initialEmail})
                </Text>
              </Pressable>
            )
          )}

          <View style={styles.buttonRow}>
            <PressableButton
              variant="secondary"
              title="취소"
              onPress={sending ? () => {} : onClose}
              pressableStyle={styles.cancelButton}
            />
            <View style={styles.sendButton}>
              <PressableButton
                disabled={!valid}
                title={sending ? '' : '보내기'}
                onPress={() => valid && !sending && onSend(email.trim())}
              />
              {sending && (
                <View style={styles.sendingOverlay} pointerEvents="none">
                  <ActivityIndicator color={WHITE} />
                </View>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000aa',
  },
  dismiss: {
    flex: 1,
  },
  // 위쪽 테두리만 밝은 유리 시트
  sheet: {
    backgroundColor: '#0e0e10',
    experimental_backgroundImage: GLASS.sheen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: GLASS.highlight,
    paddingHorizontal: 20,
    paddingTop: 22,
    gap: 14,
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
  },
  input: {
    height: 55,
    paddingHorizontal: 16,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 17,
  },
  suggestions: {
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionLocal: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  suggestionDomain: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
  },
  clearSaved: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  cardEmailHint: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
  },
  sendButton: {
    flex: 2,
  },
  sendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
