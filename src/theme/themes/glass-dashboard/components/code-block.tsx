import { memo, useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { CODE } from '../tokens'
import { DM_MONO } from '@/theme/fonts'

interface CodeBlockProps {
  code: string
  // 오른쪽 위 언어 표시 (영상의 jsx)
  language?: string
}

const FONT_SIZE = 12
const LINE_HEIGHT = 20
// 들여쓰기 한 단계(공백 2칸) 너비. DM Mono 글자 너비는 글자 크기의 0.6배
const INDENT_WIDTH = FONT_SIZE * 0.6 * 2

type TokenKind = keyof typeof TOKEN_COLORS

const TOKEN_COLORS = {
  string: CODE.string,
  keyword: CODE.keyword,
  tag: CODE.identifier,
  attribute: CODE.attribute,
  identifier: CODE.identifier,
  number: CODE.keyword,
  plain: CODE.text,
}

// 문자열 / 키워드 / JSX 태그 / 속성 이름 / 숫자
const TOKEN =
  /('[^']*'|"[^"]*"|`[^`]*`)|\b(import|from|const|let|var|return|export|default|function|if|else|true|false|null|undefined|new)\b|<\/?([A-Za-z][\w.]*)|\b([a-zA-Z]+)(?==)|\b(\d+)\b/g
// import 줄: 문자열 / 키워드 / 가져오는 이름 (영상처럼 가져오는 이름은 하늘색)
const IMPORT_TOKEN = /('[^']*'|"[^"]*")|\b(import|from)\b|\b([A-Za-z_]\w*)\b/g

// 한 줄을 색 구분 조각으로 나눈다
const tokenize = (line: string) => {
  const isImport = line.startsWith('import ')
  const parts: { text: string; kind: TokenKind }[] = []
  let last = 0
  for (const match of line.matchAll(isImport ? IMPORT_TOKEN : TOKEN)) {
    const index = match.index ?? 0
    if (index > last)
      parts.push({ text: line.slice(last, index), kind: 'plain' })
    last = index + match[0].length
    const [, string, keyword, third, attribute, number] = match
    if (string) parts.push({ text: match[0], kind: 'string' })
    else if (keyword) parts.push({ text: match[0], kind: 'keyword' })
    else if (isImport) parts.push({ text: match[0], kind: 'identifier' })
    else if (third !== undefined) {
      // 태그: 꺾쇠는 글자색, 컴포넌트(대문자)는 하늘색, HTML 태그는 글자색
      const bracket = match[0].slice(0, match[0].length - third.length)
      parts.push({ text: bracket, kind: 'plain' })
      parts.push({ text: third, kind: /^[A-Z]/.test(third) ? 'tag' : 'plain' })
    } else if (attribute) parts.push({ text: match[0], kind: 'attribute' })
    else if (number) parts.push({ text: match[0], kind: 'number' })
  }
  if (last < line.length) parts.push({ text: line.slice(last), kind: 'plain' })
  return parts
}

// 코드 창 (영상 아래의 jsx 창): 신호등 점 + 언어 표시 + 줄 번호 + 들여쓰기 안내선 + 색 구분
export const CodeBlock = memo(({ code, language }: CodeBlockProps) => {
  // 코드가 바뀔 때만 다시 나눈다
  const lines = useMemo(
    () =>
      code.split('\n').map(raw => {
        const line = raw.replace(/\t/g, '  ')
        const indent = line.length - line.trimStart().length
        // 공백 2칸마다 안내선 하나, 남는 1칸은 글자 앞에 그대로 둔다
        return {
          depth: Math.floor(indent / 2),
          parts: tokenize(' '.repeat(indent % 2) + line.trimStart()),
        }
      }),
    [code],
  )

  return (
    <View style={styles.window}>
      <View style={styles.titleBar}>
        <View style={styles.dots}>
          {CODE.dots.map(color => (
            <View
              key={color}
              style={[styles.dot, { backgroundColor: color }]}
            />
          ))}
        </View>
        {!!language && (
          <View style={styles.language}>
            <Text style={styles.languageText}>{language}</Text>
          </View>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.lines}>
          {lines.map((line, i) => (
            <View key={i} style={styles.line}>
              <Text style={styles.lineNumber}>{i + 1}</Text>
              {Array.from({ length: line.depth }, (_, d) => (
                <View key={d} style={styles.guide} />
              ))}
              <Text style={styles.code}>
                {line.parts.map((part, j) => (
                  <Text key={j} style={{ color: TOKEN_COLORS[part.kind] }}>
                    {part.text}
                  </Text>
                ))}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})

const styles = StyleSheet.create({
  window: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CODE.border,
    backgroundColor: CODE.background,
    paddingBottom: 14,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  language: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: CODE.border,
  },
  languageText: {
    color: CODE.text,
    fontFamily: DM_MONO.REGULAR,
    fontSize: 11,
  },
  lines: {
    paddingRight: 14,
  },
  line: {
    flexDirection: 'row',
    height: LINE_HEIGHT,
    alignItems: 'center',
  },
  lineNumber: {
    width: 40,
    paddingRight: 14,
    textAlign: 'right',
    color: CODE.lineNumber,
    fontFamily: DM_MONO.REGULAR,
    fontSize: FONT_SIZE,
  },
  // 들여쓰기 한 단계마다 세로 안내선
  guide: {
    width: INDENT_WIDTH,
    height: LINE_HEIGHT,
    borderLeftWidth: 1,
    borderLeftColor: CODE.guide,
  },
  code: {
    fontFamily: DM_MONO.REGULAR,
    fontSize: FONT_SIZE,
    color: CODE.text,
  },
})
