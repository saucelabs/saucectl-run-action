const { Octokit } = require('@octokit/rest');
const { createActionAuth } = require('@octokit/auth-action');
const semver = require('semver');
const os = require('os');
const tc = require('@actions/tool-cache');
const core = require('@actions/core');

const platformMatrix = {
  darwin: 'mac',
  linux: 'linux',
  win32: 'win',
};

const archMatrix = {
  x32: '32-bit',
  x64: '64-bit',
  arm64: 'arm64',
};

function getPlatform() {
  const osName = platformMatrix[os.platform()];
  const arch = archMatrix[os.arch()];
  return osName && arch && `${osName}_${arch}`;
}

function isLatestRequested(version) {
  return version === undefined || version === 'latest';
}

function isStableVersion(version) {
  return !version.prerelease && !version.draft;
}

async function selectCompatibleVersion(version) {
  // NOTE: authStrategy is set conditionally. Docs specifies that GITHUB_TOKEN needs to be set explicitly.
  //       To avoid breaking every pipeline that has no GITHUB_TOKEN set, this strategy is not passed until
  //       a token is available.
  //
  // References:
  //   - https://github.com/octokit/auth-action.js#createactionauth
  //   - https://github.com/octokit/auth-action.js/blob/main/src/index.ts#L16-L20
  //   - https://github.com/octokit/core.js/blob/main/src/index.ts#L121-L124
  const octokit = new Octokit({
    authStrategy: process.env.GITHUB_TOKEN ? createActionAuth : undefined,
  });
  const response = await octokit.request('GET /repos/:org/:repo/releases', {
    org: 'saucelabs',
    repo: 'saucectl',
  });

  const versions = response.data;
  for (let i = 0; i < versions.length; i++) {
    if (versions[i].draft || versions[i].assets?.length === 0) {
      continue;
    }
    if (isLatestRequested(version) && isStableVersion(versions[i])) {
      return versions[i];
    }
    if (semver.satisfies(versions[i].tag_name, version)) {
      return versions[i];
    }
  }
}

async function install(version) {
  // Check if saucectl is already cached. Can only look up concrete versions.
  // If latest is requested, we need to first look up what the latest version is.
  if (!isLatestRequested(version)) {
    if (addFromCache(version)) {
      return true;
    }
  }

  const release = await selectCompatibleVersion(version);
  if (!release) {
    core.setFailed(`No saucectl version compatible with ${version}`);
    return false;
  }

  const resolvedVersion = release.tag_name;
  const asset = await release.assets.find((asset) =>
    asset.name.includes(getPlatform()),
  );

  // Now that we know the resolved version, we can check the cache again.
  if (addFromCache(resolvedVersion)) {
    return true;
  }

  core.info(`Installing saucectl ${resolvedVersion}...`);

  const downloadPath = await tc.downloadTool(asset.browser_download_url);

  let extPath;
  if (os.platform() === 'win32') {
    extPath = await tc.extractZip(downloadPath);
  } else {
    extPath = await tc.extractTar(downloadPath);
  }
  const toolPath = await tc.cacheDir(extPath, 'saucectl', resolvedVersion);
  core.addPath(toolPath);

  core.info(`saucectl ${resolvedVersion} installed!`);

  return true;
}

function addFromCache(version) {
  const binPath = tc.find('saucectl', version);
  if (!binPath) {
    // FIXME remove debug statements
    const allVersions = tc.findAllVersions('saucectl');
    core.info(`Versions of saucectl available: ${allVersions}`);

    return false;
  }

  core.addPath(binPath);
  core.info(`saucectl ${version} found in cache`);

  return true;
}

module.exports = { getPlatform, selectCompatibleVersion, install };
