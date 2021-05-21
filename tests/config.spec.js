
jest.mock("@actions/core");
const core = require("@actions/core");
const { expect } = require("@jest/globals");

const { get, defaultConfig, getSettingBool, getSettingObject, getSettingString } = require("../src/config");

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


it("Config object values", async () => {
    testCases = [{
        params: { 'env': {'key1': 'val1', 'key2': 'val2'}},
        requested: ['env'],
        defaultValue: {},
        expected: {
            failed: true,
            config: {...defaultConfig, env: { key1: 'val1', key2: 'val2'}},
        },
    }];

    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
    for (const testCase of testCases) {
        failed = false;

        const {params, requested, defaultValue, expected} = testCase;
        const getCalls = core.getInput.mockImplementation((key) => params[key]);

        const getResult = getSettingObject(requested, defaultValue);

        expect(getResult).toEqual(expected.config.env);
        getCalls.mockRestore();
    }
});


it("Get global config", async () => {
    testCases = [{
        params: {},
        expected: {
            failed: false,
            errMsg: undefined,
            config: {...defaultConfig },
        },
    }, {
        params: {
            'saucectl-version': 'vX.Y-',
        },
        expected: {
            failed: true,
            errMsg: "saucectl-version: vX.Y-: invalid version format",
            config: {...defaultConfig, saucectlVersion: undefined },
        },
    }, {
        params: {
            'saucectl-version': 'v0.1.2',
        },
        expected: {
            failed: false,
            errMsg: undefined,
            config: {...defaultConfig, saucectlVersion: 'v0.1.2' },
        },
    }];

    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
    for (const testCase of testCases) {
        let failed = false;
        let error = undefined;

        const {params, expected} = testCase;
        const getCalls = core.getInput.mockImplementation((key) => params[key]);
        const failedCalls = core.setFailed.mockImplementation((errMsg) => {
            error = errMsg;
            failed = true;
        });

        const getResult = get();

        expect(getResult).toEqual(expected.config);
        expect(failed).toBe(expected.failed);
        expect(error).toBe(expected.errMsg);

        getCalls.mockRestore();
        failedCalls.mockRestore();
    }
});
