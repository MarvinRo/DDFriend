const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Adicionamos explicitamente as extensões que o Metro deve procurar
    sourceExts: [...defaultConfig.resolver.sourceExts, 'ts', 'tsx', 'cjs'],
  },
};

module.exports = mergeConfig(defaultConfig, config);