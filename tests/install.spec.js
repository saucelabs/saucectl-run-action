jest.mock('os');
const os = require('os');

const fs = require('fs');

jest.mock('@actions/core');
const core = require('@actions/core');

jest.mock('@actions/tool-cache');
const tc = require('@actions/tool-cache');

jest.mock('@octokit/rest');
const { Octokit } = require('@octokit/rest');

const install = require('../src/install.js');

const requestMock = jest.fn();
requestMock.mockImplementation(
  (target) =>
    new Promise((resolve, reject) => {
      if (target === 'GET /repos/:org/:repo/releases') {
        resolve({
          status: 200,
          headers: { location: 'mock-url' },
          data: JSON.parse(
            fs.readFileSync('./tests/fixtures/github-releases-mock.json'),
          ),
        });
      }
      reject('Unexpected Endpoint');
    }),
);
Octokit.mockImplementation(() => ({ request: requestMock }));

beforeAll(() => {
  process.env.GITHUB_ACTION = 'FAKE_IN_ACTION';
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('Version matching', async () => {
  // rewire wrapping
  const selectCompatibleVersion = install.selectCompatibleVersion;
  const testCases = [
    ['latest', 'v0.25.1'],
    ['0.25.1', 'v0.25.1'],
    ['0.25.0', 'v0.25.0'],
    ['^0.25.0', 'v0.25.1'],
    ['>=0.24.0', 'v0.25.1'],
    ['0.24.x', 'v0.24.1'],
    ['v0.26.0-alpha1', 'v0.26.0-alpha1'],
  ];
  for (let i = 0; i < testCases.length; i++) {
    let [input, expected] = testCases[i];
    let version = await selectCompatibleVersion(input);
    expect(version.tag_name).toBe(expected);
    expect(requestMock).toHaveBeenCalled();
  }
});

it('Platform matching', async () => {
  const testCases = [
    ['win32', 'x32', 'win_32-bit'],
    ['linux', 'x64', 'linux_64-bit'],
    ['darwin', 'x64', 'mac_64-bit'],
  ];
  for (let i = 0; i < testCases.length; i++) {
    const [osName, archName, expected] = testCases[i];
    os.platform.mockImplementation(() => osName);
    os.arch.mockImplementation(() => archName);
    expect(install.getPlatform()).toBe(expected);
  }
});

describe('Installation', () => {
  it('Invalid version', async () => {
    os.platform.mockReturnValue('linux');
    os.arch.mockReturnValue('x64');

    const ret = await install.saucectlInstall({ versionSpec: '0.29.5' });
    expect(ret).toBe(false);
    expect(requestMock).toHaveBeenCalled();
  });

  it('Install version - linux', async () => {
    os.platform.mockReturnValue('linux');
    os.arch.mockReturnValue('x64');
    const downloadFn = tc.downloadTool.mockReturnValue('/tmp/install-dir');
    const extractFn = tc.extractTar.mockReturnValue(
      '/tmp/install-dir-extracted',
    );
    const addPathFn = core.addPath.mockReturnValue('/bin/saucectl');

    const ret = await install.saucectlInstall({ versionSpec: '0.25.1' });

    expect(ret).toBe(true);
    expect(requestMock).toHaveBeenCalled();
    expect(downloadFn).toHaveBeenCalled();
    expect(extractFn).toHaveBeenCalled();
    expect(addPathFn).toHaveBeenCalled();
  });

  it('Install version - windows', async () => {
    os.platform.mockReturnValue('win32');
    os.arch.mockReturnValue('x32');
    const downloadFn = tc.downloadTool.mockReturnValue('/tmp/install-dir');
    const extractFn = tc.extractZip.mockReturnValue(
      '/tmp/install-dir-extracted',
    );
    const addPathFn = core.addPath.mockReturnValue('/bin/saucectl');

    const ret = await install.saucectlInstall({ versionSpec: '0.25.1' });

    expect(ret).toBe(true);
    expect(requestMock).toHaveBeenCalled();
    expect(downloadFn).toHaveBeenCalled();
    expect(extractFn).toHaveBeenCalled();
    expect(addPathFn).toHaveBeenCalled();
  });
});
