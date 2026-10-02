const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withDisableAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents.replace(
        /signingConfig signingConfigs\.(debug|release)/g,
        '// signingConfig signingConfigs.$1'
      );
    }
    return config;
  });
};