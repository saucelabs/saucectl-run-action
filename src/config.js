const core = require("@actions/core");
const semver = require('semver');

const defaultConfig = {
    saucectlVersion: 'latest',
    sauceUsername: undefined,
    sauceAccessKey: undefined,
    workingDirectory: ".",
    configurationFile: undefined,
    runRegion: undefined,
    runEnvironment: undefined,
    concurrency: undefined,
    timeout: undefined,
    sauceignore: undefined,
    skipRun: false,
    suite: undefined,
    tunnelId: undefined,
    tunnelParent: undefined,
};

const getSettingString = function(keys, defaultValue) {
    for (const key of keys) {
        const value = core.getInput(key)
        if (value) {
            return core.getInput(key);
        }
    }
    return defaultValue;
}

const getSettingBool = function(keys, defaultValue) {
    return getSettingString(keys, defaultValue.toString()).toLowerCase() == 'true'
}

const get = function() {
    let sauceConfig = {
        saucectlVersion: getSettingString(['saucectl-version'],  defaultConfig.saucectlVersion),
        sauceUsername: getSettingString(['sauce-username'], process.env.SAUCE_USERNAME),
        sauceAccessKey: getSettingString(['sauce-access-key'], process.env.SAUCE_ACCESS_KEY),
        workingDirectory: getSettingString(['working-directory'], defaultConfig.workingDirectory),
        configurationFile: getSettingString(['config-file', 'configuration-file'], defaultConfig.configurationFile),
        runRegion: getSettingString(['region'],  defaultConfig.runRegion),
        runEnvironment: getSettingString(['testing-environment', 'test-environment', 'environment'], defaultConfig.runEnvironment),
        concurrency: getSettingString(['concurrency'], defaultConfig.concurrency),
        timeout: getSettingString(['timeout'], defaultConfig.timeout),
        sauceignore: getSettingString(['sauceignore'], defaultConfig.sauceignore),
        skipRun: getSettingBool(['skip-run'], defaultConfig.skipRun),
        suite: getSettingString(['suite'], defaultConfig.suite),
        tunnelId: getSettingString(['tunnel-id'], defaultConfig.tunnelId),
        tunnelParent: getSettingString(['tunnel-parent'],  defaultConfig.tunnelParent),
    };

    if (sauceConfig.saucectlVersion != "latest") {
        if (!semver.valid(sauceConfig.saucectlVersion)) {
            core.setFailed(`saucectl-version: ${sauceConfig}: invalid version format`);
            sauceConfig.saucectlVersion = undefined;
        }
    }
    return sauceConfig;
}

module.exports = { get, defaultConfig, getSettingBool, getSettingString };