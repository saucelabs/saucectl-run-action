const core = require("@actions/core");
const semver = require('semver');

const defaultConfig = {
    saucectlVersion: 'latest',
    workingDirectory: ".",
    configurationFile: undefined,
    runRegion: undefined,
    runEnvironment: undefined,
    skipRun: false,
    suite: undefined,
};

const get = function() {
    let sauceConfig = {
        saucectlVersion: core.getInput('saucectl-version') || defaultConfig.saucectlVersion,
        workingDirectory: core.getInput('working-directory') || defaultConfig.workingDirectory,
        configurationFile: core.getInput('configuration-file') || defaultConfig.configurationFile,
        runRegion: core.getInput('region') || defaultConfig.runRegion,
        runEnvironment: core.getInput('environment') || defaultConfig.runEnvironment,
        skipRun: core.getInput('skip-run') || defaultConfig.skipRun,
        suite: core.getInput('suite') || defaultConfig.suite,
    };

    if (sauceConfig.saucectlVersion != "latest") {
        if (!semver.valid(sauceConfig.saucectlVersion)) {
            core.setFailed(`saucectl-version: ${sauceConfig}: invalid version format`);
            sauceConfig.saucectlVersion = undefined;
        }
    }
    return sauceConfig;
}

module.exports = { get };