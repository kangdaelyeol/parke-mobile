const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const defaultConfig = getDefaultConfig(__dirname)

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    useWatchman: true,
  },
  maxWorkers: 2,
  resetCache: true,
}

module.exports = mergeConfig(defaultConfig, config)
