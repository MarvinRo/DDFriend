const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withJava25Gradle = (config) =>
  withDangerousMod(config, [
    'android',
    async (config) => {
      const wrapper = path.join(
        config.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties',
      );
      const properties = fs.readFileSync(wrapper, 'utf8');
      const updated = properties.replace(
        /distributionUrl=.*gradle-[^/]+-bin\.zip/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-9.1.0-bin.zip',
      );
      if (updated === properties && !properties.includes('gradle-9.1.0-bin.zip')) {
        throw new Error(`Could not update Gradle wrapper at ${wrapper}`);
      }
      fs.writeFileSync(wrapper, updated);
      return config;
    },
  ]);

module.exports = withJava25Gradle;
