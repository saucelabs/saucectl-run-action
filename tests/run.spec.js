jest.mock("child_process");
jest.mock("../src/helpers.js");
const childProcess = require("child_process");
const { expect, it } = require("@jest/globals");
const config = require("../src/config.js");
const run = require("../src/run.js");
const helpers = require("../src/helpers.js");

it("Argument builds", async () => {
    const testCases = [{
        input: { ...config.defaultConfig },
        expected: ['run']
    }, {
        input: { ...config.defaultConfig, configurationFile: '.sauce/custom-name.yml' },
        expected: ['run', '-c', '.sauce/custom-name.yml']
    }, {
        input: { ...config.defaultConfig, runRegion: 'eu-central-1' },
        expected: ['run', '--region', 'eu-central-1']
    }, {
        input: { ...config.defaultConfig, selectSuite: 'mySuiteName' },
        expected: ['run', '--select-suite', 'mySuiteName']
    }, {
        input: { ...config.defaultConfig, tunnelName: 'my-tunnel-name', tunnelOwner: 'my-tunnel-owner' },
        expected: ['run', '--tunnel-name', 'my-tunnel-name', '--tunnel-owner', 'my-tunnel-owner']
    }, {
        input: { ...config.defaultConfig, concurrency: 3 },
        expected: ['run', '--ccy', 3]
    }, {
        input: { ...config.defaultConfig, timeout: 15 },
        expected: ['run', '--timeout', 15]
    }, {
        input: { ...config.defaultConfig, sauceignore: 'my/.sauceignore' },
        expected: ['run', '--sauceignore', 'my/.sauceignore']
    }, {
        input: { ...config.defaultConfig, showConsoleLog: true },
        expected: ['run', '--show-console-log']
    }, {
        input: { ...config.defaultConfig, env: ['key1=val1', 'key2=val2']},
        expected: ['run', '-e', 'key1=val1', '-e', 'key2=val2']
    }, {
        input: { ...config.defaultConfig, async: true},
        expect: ['run', '--async']
    }];

    for (let i = 0; i < testCases.length; i++) {
        const {input, expected} = testCases[i];
        const output = run.buildSaucectlArgs(input);
        expect(output).toStrictEqual(expected);
    }
});

it('Start saucectl', async () => {
    childProcess.spawn.mockReturnValue({});
    const tests = [{
        params: {},
        returnValue: 0,
        expectedValue: true
    }, {
        params: {},
        returnValue: 1,
        expectedValue: false
    }, {
        params: {
            workingDirectory: '.',
        },
        returnValue: 0,
        expectedValue: true
    }, {
        params: {
            workingDirectory: '/non-existent',
        },
        returnValue: 1,
        expectedValue: false
    }];
    for (let i = 0; i < tests.length; i++) {
        const testCase = tests[i];
        helpers.awaitExecution.mockReturnValue(testCase.returnValue);
        const status = await run.saucectlRun(testCase.params);
        expect(status).toBe(testCase.expectedValue);
    }
});
