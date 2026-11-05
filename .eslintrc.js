module.exports = {
  root: true,
  extends: '@react-native',
  // 백엔드 함수 빌드 결과물 (backend/functions/src에서 만들어진다)
  ignorePatterns: ['backend/functions/lib/'],
  rules: {
    // 로그는 logger로만 남긴다 (console은 릴리스 빌드에서도 기기 로그에 남는다)
    'no-console': 'error',
  },
  overrides: [
    {
      files: ['src/utils/logger/*.ts'],
      rules: { 'no-console': 'off' },
    },
  ],
}
