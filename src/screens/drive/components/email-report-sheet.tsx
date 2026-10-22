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

// 운행 기록을 받을 이메일 입력. '@' 뒤 도메인은 목록에서 골라 완성할 수 있다
export const EmailReportSheet = ({
  visible,
  initialEmail,
  sending,
  onClose,
  onSend,
  onClearSaved,
}: DriveEmailSheetProps) => {
  const { bottom } = useSafeAreaInsets()
  const [email, setEmail] = useState(initialEmail)
  const [focused, setFocused] = useState(false)

  // 열 때마다 마지막으로 보낸 주소로 채운다
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
              style={[styles.input, focused && styles.inputFocused]}
            />
            {suggestions.length > 0 && (
              <View style={styles.suggestions}>
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
                            pressed && styles.suggestionPressed,
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

          {!!initialEmail && (
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
          )}

          <View style={styles.buttonRow}>
            <PressableButton
              title="취소"
              onPress={sending ? () => {} : onClose}
              background={[DARK, DARK_LIGHT]}
              border={[DARK_LIGHT, GRAY_DEEP]}
              text={[WHITE, WHITE]}
              pressableStyle={styles.cancelButton}
            />
            <View style={styles.sendButton}>
              <PressableButton
                title={sending ? '' : '보내기'}
                onPress={() => valid && !sending && onSend(email.trim())}
                background={
                  valid ? [BLUE_PRIMARY, '#1732ff'] : [DARK_LIGHT, DARK_LIGHT]
                }
                text={valid ? [WHITE, WHITE] : [GRAY, GRAY]}
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
  sheet: {
    backgroundColor: DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: DARK_LIGHT,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: '#141414',
    paddingHorizontal: 16,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 17,
  },
  inputFocused: {
    borderColor: GRAY,
  },
  suggestions: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: DARK_LIGHT,
    backgroundColor: '#141414',
    overflow: 'hidden',
  },
  suggestion: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionPressed: {
    backgroundColor: DARK_LIGHT,
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
