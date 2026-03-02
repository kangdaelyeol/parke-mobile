const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// RegExp 안전하게 만들기 위해 escape
const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const root = escapeRegExp(__dirname.replace(/\\/g, '/')); // windows 대비

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],

    // ✅ 프로젝트 루트의 산출물만 차단 (node_modules의 dist는 차단 X)
    blockList: [
      new RegExp(`^${root}/dist/.*`),
      new RegExp(`^${root}/build/.*`),
      new RegExp(`^${root}/out/.*`),
      new RegExp(`^${root}/ios/build/.*`),
      new RegExp(`^${root}/android/app/build/.*`),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
