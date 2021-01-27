const semver = require('semver');

const defaultConfig = {
    saucectlVersion: 'latest',
    workingDirectory: ".",
    configurationFile: ".sauce/config.yml",
    region: undefined,
    suite: undefined,
};

const get = function() {
    let sauceConfig = {
        saucectlVersion: core.getInput('saucectl-version') || defaultConfig.saucectlVersion,
        workingDirectory: core.getInput('working-directory') || defaultConfig.workingDirectory,
        configurationFile: core.getInput('working-directory') || defaultConfig.configurationFile,
        suite: core.getInput('suite') || defaultConfig.suite,
    };

    if (sauceConfig.saucectlVersion != "latest") {
        if (!semver.valid(sauceConfig.saucectlVersion)) {
            core.setFailed(`saucectl-version: ${sauceConfig}: invalid version format`);
        }
    }
    return sauceConfig;
}

export default { get }