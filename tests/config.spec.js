
jest.mock("@actions/core");
const core = require("@actions/core");
const { expect } = require("@jest/globals");

const { get, defaultConfig, getSettingBool, getSettingString } = require("../src/config");

let failed;

it("Config value accessor", async () => {
    testCases = [{
        params: {},
        requested: ['dummy-key'],
        defaultValue: 'xx',
        expected: {
            value: 'xx',
            calls: 1,
        },
    }, {
        params: {
            firstKey: 'dummy-value'
        },
        requested: ['firstKey'],
        defaultValue: 'xx',
        expected: {
            value: 'dummy-value',
            calls: 1,
        },
    }, {
        params: {
            thirdKey: 'dummy-value'
        },
        requested: ['firstKey', 'secondKey', 'thirdKey'],
        defaultValue: 'xx',
        expected: {
            value: 'dummy-value',
        },
    }];

    for (const testCase of testCases) {
        failed = false;

        const {params, requested, defaultValue, expected} = testCase;
        const getCalls = core.getInput.mockImplementation((key) => params[key]);
        
        const getResult = getSettingString(requested, defaultValue);
        
        expect(getResult).toEqual(expected.value);
        getCalls.mockRestore();
    }
});

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

    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
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
