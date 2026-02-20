const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];
config.resolver.assetExts.push("glb", "gltf");

module.exports = withNativeWind(config, { input: "./app/globals.css" });
