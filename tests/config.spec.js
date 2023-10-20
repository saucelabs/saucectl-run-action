jest.mock('@actions/core');
const core = require('@actions/core');

const {
  get,
  defaultConfig,
  getEnvVariables,
  getSettingString,
} = require('../src/config');

it('Config value accessor', async () => {
  const testCases = [
    {
      params: {},
      requested: ['dummy-key'],
      defaultValue: 'xx',
      expected: {
        value: 'xx',
        calls: 1,
      },
    },
    {
      params: {
        firstKey: 'dummy-value',
      },
      requested: ['firstKey'],
      defaultValue: 'xx',
      expected: {
        value: 'dummy-value',
        calls: 1,
      },
    },
    {
      params: {
        thirdKey: 'dummy-value',
      },
      requested: ['firstKey', 'secondKey', 'thirdKey'],
      defaultValue: 'xx',
      expected: {
        value: 'dummy-value',
      },
    },
  ];

  for (const testCase of testCases) {
    const { params, requested, defaultValue, expected } = testCase;
    const getCalls = core.getInput.mockImplementation((key) => params[key]);

    const getResult = getSettingString(requested, defaultValue);

    expect(getResult).toEqual(expected.value);
    getCalls.mockRestore();
  }
});

it('Config env values', async () => {
  const testCases = [
    {
      params: { env: 'key1=val1\nkey2=val2\n' },
      requested: ['env'],
      expected: {
        failed: true,
        config: { ...defaultConfig, env: ['key1=val1', 'key2=val2'] },
      },
    },
    {
      params: { env: 'key1=val1' },
      requested: ['env'],
      expected: {
        failed: true,
        config: { ...defaultConfig, env: ['key1=val1'] },
      },
    },
    {
      params: { env: 'key1=val1\nkey2=val2\n\n' },
      requested: ['env'],
      expected: {
        failed: true,
        config: { ...defaultConfig, env: ['key1=val1', 'key2=val2'] },
      },
    },
    {
      params: { env: 'k=\nkey1=val1\nkey2=val2\n\n' },
      requested: ['env'],
      expected: {
        failed: true,
        config: { ...defaultConfig, env: ['k=', 'key1=val1', 'key2=val2'] },
      },
    },
  ];

  delete process.env.SAUCE_USERNAME;
  delete process.env.SAUCE_ACCESS_KEY;
  for (const testCase of testCases) {
    const { params, requested, expected } = testCase;
    const getCalls = core.getInput.mockImplementation((key) => params[key]);

    const getResult = getEnvVariables(requested);

    expect(getResult).toEqual(expected.config.env);
    getCalls.mockRestore();
  }
});

it('Get global config', async () => {
  const testCases = [
    {
      params: {},
      expected: {
        failed: false,
        errMsg: undefined,
        config: { ...defaultConfig },
      },
    },
    {
      params: {
        'saucectl-version': 'vX.Y-',
      },
      expected: {
        failed: true,
        errMsg: 'saucectl-version: vX.Y-: invalid version format',
        config: { ...defaultConfig, saucectlVersion: undefined },
      },
    },
    {
      params: {
        'saucectl-version': 'v0.1.2',
      },
      expected: {
        failed: false,
        errMsg: undefined,
        config: { ...defaultConfig, saucectlVersion: 'v0.1.2' },
      },
    },
  ];

  delete process.env.SAUCE_USERNAME;
  delete process.env.SAUCE_ACCESS_KEY;
  for (const testCase of testCases) {
    let failed = false;
    let error = undefined;

    const { params, expected } = testCase;
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
