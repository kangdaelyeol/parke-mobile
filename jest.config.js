module.exports = {
  preset: 'react-native',
  // 예전 작업용 git worktree(.claude/)와 백엔드 함수(backend/)는 앱 테스트 대상이 아니다
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/.claude/',
    '<rootDir>/backend/',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.claude/', '<rootDir>/backend/'],
}
