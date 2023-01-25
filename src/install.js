const { Octokit } = require("@octokit/rest");
const { createActionAuth } = require("@octokit/auth-action");
const semver = require("semver");
const os = require('os');
const tc = require('@actions/tool-cache');
const core = require('@actions/core');

const platformMatrix = {
    'darwin': "mac",
    'linux': "linux",
    'win32': "win",
};

const archMatrix = {
    'x32': "32-bit",
    'x64': "64-bit",
};

function getPlatform() {
    const osName = platformMatrix[os.platform()];
    const arch = archMatrix[os.arch()];
    return osName && arch && `${osName}_${arch}`;
}

async function selectCompatibleVersion(versionSpec) {
    const octokit = new Octokit();
    const response = await octokit.request("GET /repos/:org/:repo/releases", {
        org: "saucelabs",
        repo: "saucectl",
    });
    
    const versions = response.data;
    for (let i = 0; i < versions.length; i++) {
        if (versionSpec === undefined || versionSpec === "latest"
            || semver.satisfies(versions[i].tag_name, versionSpec)) {
            return versions[i];
        }
    }
}

async function saucectlInstall({ versionSpec }) {
    const release = await selectCompatibleVersion(versionSpec);
    if (!release) {
        core.setFailed(`No saucectl version compatible with ${versionSpec}`);
        return false;
    }

    const resolvedVersion = release.tag_name;
    const asset = await release.assets.find(asset => asset.name.includes(getPlatform()));
    core.info(`Installing saucectl ${resolvedVersion}...`);

    // https://github.com/actions/setup-node/blob/main/src/installer.ts#L52
    //toolPath = tc.find('node', versionSpec);
    const downloadPath = await tc.downloadTool(asset.browser_download_url);

    let extPath;
    if (os.platform() == 'win32') {
        extPath = await tc.extractZip(downloadPath);
    } else {
        extPath = await tc.extractTar(downloadPath);
    }
    toolPath = await tc.cacheDir(extPath, 'saucectl', resolvedVersion);
    core.addPath(toolPath);
    core.info(`saucectl ${resolvedVersion} installed !`);
    return true;
}

module.exports = { getPlatform, selectCompatibleVersion, saucectlInstall };
