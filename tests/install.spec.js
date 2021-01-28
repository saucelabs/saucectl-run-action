jest.mock("os");
const os = require("os");

const rewire = require("rewire");
const fs = require("fs");

const nock = require('nock');
const install = rewire("../src/install.js");

beforeAll(() => {
    process.env.GITHUB_ACTION = "FAKE_IN_ACTION";
});

describe("Version Matching", () => {
    beforeAll(() => {
        os.platform.mockImplementation(() => "windows" );
    });

    it("Version matching", async () => {
        // rewire wrapping
        const selectCompatibleVersion = install.__get__("selectCompatibleVersion");
        testsCases = [["0.25.1", "v0.25.1"], ["0.25.0", "v0.25.0"], ["^0.25.0", "v0.25.1"], [">=0.24.0", "v0.25.1"], ["0.24.x", "v0.24.1"]];
        for (let i = 0; i < testsCases.length; i++) {
            const scope = nock('https://api.github.com')
                .get('/repos/saucelabs/saucectl/releases')
                .reply(200, JSON.parse(fs.readFileSync("./tests/fixtures/github-releases-mock.json")));

            let [input, expected] = testsCases[i];
            let version = await selectCompatibleVersion(input);
            expect(version.tag_name).toBe(expected);
            expect(scope.isDone()).toBe(true);
        }
    });
});
