/** @type {import('react-native-reanimated/plugin').PluginOptions} */

const { compilerOptions } = require('./tsconfig.json')

// 경로 별칭은 tsconfig.json의 paths 한 곳에서만 관리한다
// ("@home/*": ["./src/screens/home/*"] → '@home': './src/screens/home')
const alias = Object.fromEntries(
  Object.entries(compilerOptions.paths).map(([key, [target]]) => [
    key.replace(/\/\*$/, ''),
    target.replace(/\/\*$/, ''),
  ]),
)

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias,
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
