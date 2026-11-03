import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { EMAIL_DOMAINS } from '@/constants'
import { PRETENDARD } from '@/theme/fonts'
import { GRAY, GRAY_DEEP, WHITE } from '@/theme/color'
import { glassStyles } from '@/theme/glass'

interface EmailDomainInputProps {
  title: string
  value: string
  // 아이디가 비어 있으면 빈 문자열
  onChangeText: (email: string) => void
}

const CUSTOM = '직접 입력'

const split = (email: string) => {
  const at = email.indexOf('@')
  return at === -1
    ? { local: email, domain: '' }
    : { local: email.slice(0, at), domain: email.slice(at + 1) }
}

// [아이디] @ [도메인 선택] 형식의 이메일 입력. 목록에 없는 도메인은 직접 입력한다
export const EmailDomainInput = ({
  title,
  value,
  onChangeText,
}: EmailDomainInputProps) => {
  const initial = split(value)
  const [local, setLocal] = useState(initial.local)
  const [domain, setDomain] = useState(initial.domain || EMAIL_DOMAINS[0])
  const [custom, setCustom] = useState(
    !!initial.domain && !EMAIL_DOMAINS.includes(initial.domain),
  )
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(false)

  const emit = (nextLocal: string, nextDomain: string) =>
    onChangeText(nextLocal ? `${nextLocal}@${nextDomain}` : '')

  // 전체 주소를 붙여 넣으면 아이디와 도메인으로 나눈다
  const localInput = (text: string) => {
    const next = split(text.replace(/\s/g, ''))
    setLocal(next.local)
    if (next.domain) {
      setDomain(next.domain)
      setCustom(!EMAIL_DOMAINS.includes(next.domain))
      return emit(next.local, next.domain)
    }
    emit(next.local, domain)
  }

  const domainInput = (text: string) => {
    const next = text.replace(/[\s@]/g, '')
    setDomain(next)
    emit(local, next)
  }

  const select = (option: string) => {
    setOpen(false)
    if (option === CUSTOM) {
      setCustom(true)
      setDomain('')
      return emit(local, '')
    }
    setCustom(false)
    setDomain(option)
    emit(local, option)
  }

  const active = focus || open

  return (
    <View style={styles.container}>
      <Text style={[styles.title, active && styles.titleFocused]}>{title}</Text>
      <View style={styles.row}>
        <TextInput
          style={[
            glassStyles.field,
            styles.box,
            styles.input,
            focus && glassStyles.fieldFocused,
          ]}
          value={local}
          onChangeText={localInput}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="아이디"
          placeholderTextColor={GRAY_DEEP}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.at}>@</Text>
        <View
          style={[
            glassStyles.field,
            styles.box,
            styles.domainBox,
            open && glassStyles.fieldFocused,
          ]}
        >
          {custom ? (
            <TextInput
              style={[styles.input, styles.domainText]}
              value={domain}
              onChangeText={domainInput}
              placeholder="도메인 입력"
              placeholderTextColor={GRAY_DEEP}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <Pressable
              style={styles.domainText}
              onPress={() => setOpen(o => !o)}
            >
              <Text style={styles.domainLabel} numberOfLines={1}>
                {domain}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={styles.chevron}
            onPress={() => setOpen(o => !o)}
            hitSlop={8}
          >
            <FontAwesome6
              name={open ? 'chevron-up' : 'chevron-down'}
              iconStyle="solid"
              size={12}
              color={GRAY}
            />
          </Pressable>
        </View>
      </View>
      {open && (
        <View style={[glassStyles.field, styles.options]}>
          {[...EMAIL_DOMAINS, CUSTOM].map(option => {
            const selected = custom ? option === CUSTOM : option === domain
            return (
              <Pressable key={option} onPress={() => select(option)}>
                {({ pressed }) => (
                  <View style={[styles.option, pressed && glassStyles.pressed]}>
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {selected && (
                      <FontAwesome6
                        name="check"
                        iconStyle="solid"
                        size={12}
                        color={WHITE}
                      />
                    )}
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 13,
  },
  titleFocused: {
    color: WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  box: {
    flex: 1,
    height: 55,
  },
  input: {
    paddingHorizontal: 14,
    fontSize: 16,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
  },
  at: {
    color: GRAY,
    fontFamily: PRETENDARD.BOLD,
    fontSize: 16,
  },
  domainBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domainText: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  domainLabel: {
    paddingLeft: 14,
    fontSize: 16,
    color: WHITE,
    fontFamily: PRETENDARD.MEDIUM,
  },
  chevron: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },
  options: {
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  optionText: {
    color: GRAY,
    fontFamily: PRETENDARD.MEDIUM,
    fontSize: 15,
  },
  optionSelected: {
    color: WHITE,
    fontFamily: PRETENDARD.BOLD,
  },
})
