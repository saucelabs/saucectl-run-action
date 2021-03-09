
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
    },
    {
        input: { ...config.defaultConfig, configurationFile: '.sauce/custom-name.yml' },
        expected: ['run', '-c', '.sauce/custom-name.yml']
    },
    {
        input: { ...config.defaultConfig, runRegion: 'eu-central-1' },
        expected: ['run', '--region', 'eu-central-1']
    },
    {
        input: { ...config.defaultConfig, runEnvironment: 'sauce' },
        expected: ['run', '--test-env', 'sauce']
    },
    {
        input: { ...config.defaultConfig, suite: 'mySuiteName' },
        expected: ['run', '--suite', 'mySuiteName']
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
        returnValue: 0,
        expectedValue: true
    }, {
        returnValue: 1,
        expectedValue: false
    }];
    for (let i = 0; i < tests.length; i++) {
        const testCase = tests[i];
        helpers.awaitExecution.mockReturnValue(testCase.returnValue);
        const status = await run.saucectlRun({});
        expect(status).toBe(testCase.expectedValue);
    }
});