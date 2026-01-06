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
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
