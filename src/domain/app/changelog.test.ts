import { APP_VERSION, CHANGELOG } from './changelog'

const parse = (version: string) => {
  const [major = NaN, minor = NaN, patch = NaN] = version.split('.').map(Number)
  return { major, minor, patch }
}

// 위(최신)부터 바로 아래 버전과 짝을 짓는다
const pairs = CHANGELOG.slice(1).map((older, i) => ({
  newer: CHANGELOG[i],
  older,
}))

// 커밋할 때 changelog.ts 맨 위에 항목을 더하는 규칙을 지키는지 본다
describe('변경 내역', () => {
  it('맨 위 항목이 앱 버전이다', () => {
    expect(CHANGELOG[0]?.version).toBe(APP_VERSION)
  })

  it('버전은 x.y.z, 날짜는 YYYY-MM-DD, 항목마다 바뀐 내용이 있다', () => {
    CHANGELOG.forEach(entry => {
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/)
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.changes.length).toBeGreaterThan(0)
    })
  })

  it('버전 단위(bump)만큼 바로 아래 버전에서 올라간다', () => {
    pairs.forEach(({ newer, older }) => {
      if (!newer) return
      const a = parse(newer.version)
      const b = parse(older.version)
      const expected = {
        major: { major: b.major + 1, minor: 0, patch: 0 },
        minor: { major: b.major, minor: b.minor + 1, patch: 0 },
        patch: { major: b.major, minor: b.minor, patch: b.patch + 1 },
      }[newer.bump]
      expect({ version: newer.version, ...a }).toEqual({
        version: newer.version,
        ...expected,
      })
    })
  })

  it('위 항목일수록 날짜가 같거나 더 최근이다', () => {
    pairs.forEach(({ newer, older }) => {
      if (!newer) return
      expect(newer.date >= older.date).toBe(true)
    })
  })
})
