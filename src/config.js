const core = require('@actions/core');
const semver = require('semver');

const defaultConfig = {
  saucectlVersion: 'latest',
  sauceUsername: undefined,
  sauceAccessKey: undefined,
  workingDirectory: '.',
  configurationFile: undefined,
  runRegion: undefined,
  concurrency: undefined,
  timeout: undefined,
  sauceignore: undefined,
  skipRun: false,
  selectSuite: undefined,
  tunnelName: undefined,
  tunnelOwner: undefined,
  tunnelTimeout: undefined,
  showConsoleLog: false,
  env: [],
  async: false,
};

const getEnvVariables = function (keys) {
  const str = getSettingString(keys, '');
  const lines = str.split('\n');
  const envVars = [];
  for (const line of lines) {
    if (line !== '') {
      envVars.push(line);
    }
  }
  return envVars;
};

const getSettingString = function (keys, defaultValue) {
  for (const key of keys) {
    const value = core.getInput(key);
    if (value) {
      return value;
    }
  }
  return defaultValue;
};

const getSettingBool = function (keys, defaultValue) {
  return (
    getSettingString(keys, defaultValue.toString()).toLowerCase() === 'true'
  );
};

const get = function () {
  let sauceConfig = {
    saucectlVersion: getSettingString(
      ['saucectl-version'],
      defaultConfig.saucectlVersion,
    ),
    sauceUsername: getSettingString(
      ['sauce-username'],
      process.env.SAUCE_USERNAME,
    ),
    sauceAccessKey: getSettingString(
      ['sauce-access-key'],
      process.env.SAUCE_ACCESS_KEY,
    ),
    workingDirectory: getSettingString(
      ['working-directory'],
      defaultConfig.workingDirectory,
    ),
    configurationFile: getSettingString(
      ['config-file', 'configuration-file'],
      defaultConfig.configurationFile,
    ),
    runRegion: getSettingString(['region'], defaultConfig.runRegion),
    concurrency: getSettingString(['concurrency'], defaultConfig.concurrency),
    timeout: getSettingString(['timeout'], defaultConfig.timeout),
    sauceignore: getSettingString(['sauceignore'], defaultConfig.sauceignore),
    skipRun: getSettingBool(['skip-run'], defaultConfig.skipRun),
    selectSuite: getSettingString(['select-suite'], defaultConfig.selectSuite),
    tunnelName: getSettingString(['tunnel-name'], defaultConfig.tunnelName),
    tunnelOwner: getSettingString(['tunnel-owner'], defaultConfig.tunnelOwner),
    tunnelTimeout: getSettingString(
      ['tunnel-timeout'],
      defaultConfig.tunnelTimeout,
    ),
    env: getEnvVariables(['env']),
    showConsoleLog: getSettingBool(
      ['show-console-log'],
      defaultConfig.showConsoleLog,
    ),
    async: getSettingBool(['async'], defaultConfig.async),
  };

  if (sauceConfig.saucectlVersion !== 'latest') {
    if (!semver.valid(sauceConfig.saucectlVersion)) {
      core.setFailed(
        `saucectl-version: ${sauceConfig.saucectlVersion}: invalid version format`,
      );
      sauceConfig.saucectlVersion = undefined;
    }
  }
  return sauceConfig;
};

module.exports = {
  get,
  defaultConfig,
  getSettingBool,
  getSettingString,
  getEnvVariables,
};
