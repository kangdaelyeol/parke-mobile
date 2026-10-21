import { EMAIL_DOMAINS } from '@/constants'

const MAX_SUGGESTIONS = 5

// 입력 중인 이메일의 도메인 자동완성 후보.
// "abc" → abc@gmail.com, abc@naver.com …
// "abc@na" → abc@naver.com, abc@nate.com
export const getEmailSuggestions = (input: string): string[] => {
  const value = input.trim()
  const at = value.indexOf('@')
  const local = at === -1 ? value : value.slice(0, at)
  if (!local) return []

  const typedDomain = at === -1 ? '' : value.slice(at + 1).toLowerCase()
  return EMAIL_DOMAINS.filter(
    domain => domain.startsWith(typedDomain) && domain !== typedDomain,
  )
    .slice(0, MAX_SUGGESTIONS)
    .map(domain => `${local}@${domain}`)
}

export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
