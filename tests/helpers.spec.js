
const childProcess = require("child_process");
const { describe, expect, it } = require("@jest/globals");
const helpers = require("../src/helpers.js");

describe('Helpers', () => {
  it('Returns success', async () => {
    const child = childProcess.spawn('ls');
    const retValue = await helpers.awaitExecution(child);
    expect(retValue).toBe(0);
  });

  it('Returns failure', async () => {
    const child = childProcess.spawn('ls', ['-l', '/non-existent-dir']);
    const retValue = await helpers.awaitExecution(child);
    expect(retValue).not.toBe(0);
  });
});