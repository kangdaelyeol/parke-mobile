/** @type {import('react-native-worklets/plugin').PluginOptions} */

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@home': './src/screens/home',
          '@on-boarding': './src/screens/on-boarding',
          '@profile': './src/screens/profile',
          '@setting': './src/screens/setting',
          '@search-ble': './src/screens/search-ble',
        },
        extentions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    ],
    'react-native-worklets/plugin',
  ],
};
