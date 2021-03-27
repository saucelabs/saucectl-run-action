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

const get = function() {
    let sauceConfig = {
        saucectlVersion: core.getInput('saucectl-version') || defaultConfig.saucectlVersion,
        sauceUsername: core.getInput('sauce-username') || process.env.SAUCE_USERNAME || defaultConfig.sauceUsername,
        sauceAccessKey: core.getInput('sauce-access-key') || process.env.SAUCE_ACCESS_KEY || defaultConfig.sauceAccessKey,
        workingDirectory: core.getInput('working-directory') || defaultConfig.workingDirectory,
        configurationFile: core.getInput('config-file') || core.getInput('configuration-file') || defaultConfig.configurationFile,
        runRegion: core.getInput('region') || defaultConfig.runRegion,
        runEnvironment: core.getInput('testing-environment') || core.getInput('test-environment') || core.getInput('environment') || defaultConfig.runEnvironment,
        concurrency: core.getInput('concurrency') || defaultConfig.concurrency,
        timeout: core.getInput('timeout') || defaultConfig.timeout,
        sauceignore: core.getInput('sauceignore') || defaultConfig.sauceignore,
        skipRun: (core.getInput('skip-run') || '').toLowerCase() == 'true',
        suite: core.getInput('suite') || defaultConfig.suite,
        tunnelId: core.getInput('tunnel-id') || defaultConfig.tunnelId,
        tunnelParent: core.getInput('tunnel-parent') || defaultConfig.tunnelParent,
    };

    if (sauceConfig.saucectlVersion != "latest") {
        if (!semver.valid(sauceConfig.saucectlVersion)) {
            core.setFailed(`saucectl-version: ${sauceConfig}: invalid version format`);
            sauceConfig.saucectlVersion = undefined;
        }
    }
    return sauceConfig;
}

module.exports = { get, defaultConfig };