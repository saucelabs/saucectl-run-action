const core = require('@actions/core');
const childProcess = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const { awaitExecution } = require('./helpers');

const lstat = promisify(fs.lstat);

function buildSaucectlArgs(opts) {
  const args = ['run'];
  if (opts.configurationFile) {
    args.push('-c', opts.configurationFile);
  }
  if (opts.runRegion) {
    args.push('--region', opts.runRegion);
  }
  if (opts.concurrency) {
    args.push('--ccy', opts.concurrency);
  }
  if (opts.selectSuite) {
    args.push('--select-suite', opts.selectSuite);
  }
  if (opts.timeout) {
    args.push('--timeout', opts.timeout);
  }
  if (opts.tunnelName) {
    args.push('--tunnel-name', opts.tunnelName);
  }
  if (opts.tunnelOwner) {
    args.push('--tunnel-owner', opts.tunnelOwner);
  }
  if (opts.sauceignore) {
    args.push('--sauceignore', opts.sauceignore);
  }
  if (opts.showConsoleLog) {
    args.push('--show-console-log');
  }
  for (const env of opts.env || []) {
    args.push('-e', env);
  }
  if (opts.async) {
    args.push('--async');
  }
  return args;
}

async function saucectlRun(opts) {
  const { workingDirectory } = opts;

  if (workingDirectory) {
    let stats;
    try {
      stats = await lstat(workingDirectory);
    } catch {
      core.setFailed(
        `${workingDirectory} does not exist or is not accessible.`,
      );
      return false;
    }
    if (!stats.isDirectory()) {
      core.setFailed(`${workingDirectory} is not a directory.`);
      return false;
    }
    process.chdir(workingDirectory);
  }

  const saucectlArgs = buildSaucectlArgs(opts);
  core.info(`saucectl ${saucectlArgs.join(' ')}`);

  const child = childProcess.spawn('saucectl', saucectlArgs, {
    env: {
      ...process.env,
      SAUCE_USERNAME: opts.sauceUsername,
      SAUCE_ACCESS_KEY: opts.sauceAccessKey,
    },
  });

  const exitCode = await awaitExecution(child);

  if (exitCode !== 0) {
    core.setFailed(`saucectl: Failure`);
    return false;
  }
  return true;
}

module.exports = { saucectlRun, awaitExecution, buildSaucectlArgs };
