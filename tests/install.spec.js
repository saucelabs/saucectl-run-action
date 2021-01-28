jest.mock("os");
const os = require("os");

const rewire = require("rewire");
const fs = require("fs");

const nock = require('nock');
const install = require("../src/install.js");

beforeAll(() => {
    process.env.GITHUB_ACTION = "FAKE_IN_ACTION";
});

it("Version matching", async () => {
    // rewire wrapping
    const selectCompatibleVersion = install.selectCompatibleVersion;
    const testCases = [["0.25.1", "v0.25.1"], ["0.25.0", "v0.25.0"], ["^0.25.0", "v0.25.1"], [">=0.24.0", "v0.25.1"], ["0.24.x", "v0.24.1"]];
    for (let i = 0; i < testCases.length; i++) {
        const scope = nock('https://api.github.com')
            .get('/repos/saucelabs/saucectl/releases')
            .reply(200, JSON.parse(fs.readFileSync("./tests/fixtures/github-releases-mock.json")));

        let [input, expected] = testCases[i];
        let version = await selectCompatibleVersion(input);
        expect(version.tag_name).toBe(expected);
        expect(scope.isDone()).toBe(true);
    }
});

it("Platform matching", async () => {
    const testCases = [
        ["win32", "x32", "win_32-bit"],
        ["linux", "x64", "linux_64-bit"],
        ["darwin", "x64", "mac_64-bit"]
    ];
    for (let i = 0; i < testCases.length; i++) {
        const [osName, archName, expected] = testCases[i];
        os.platform.mockImplementation(() => osName );
        os.arch.mockImplementation(() => archName );
        expect(install.getPlatform()).toBe(expected);
    }
});