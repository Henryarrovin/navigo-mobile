const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

config = withNativeWind(config, { input: "./src/global.css" });

config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts.push("svg");

config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

module.exports = config;
