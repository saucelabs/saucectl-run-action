
jest.mock("@actions/core");
const core = require("@actions/core");
const { expect } = require("@jest/globals");

const { get, defaultConfig } = require("../src/config");

let failed;

it("Config default values", async () => {
    testCases = [{
        params: {},
        expected: { 
            failed: false,
            config: defaultConfig,
        },
    }, {
        params: { 'saucectl-version': 'v3.zx-'},
        expected: { 
            failed: true,
            config: {...defaultConfig, saucectlVersion: undefined },
        },
    }];

    for (let i = 0; i < testCases.length; i++) {
        failed = false;

        const {params, expected} = testCases[i];
        core.getInput.mockImplementation((key) => params[key]);
        const failedFn = core.setFailed.mockImplementation(() => {});
        
        const getResult = get()
        
        expect(getResult).toEqual(expected.config);
        if (expected.failed) {
            expect(failedFn).toHaveBeenCalled();
        }
    }
});
