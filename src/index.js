const core = require('@actions/core');
const childProcess = require('child_process');
const { install } = require('./install');
const { saucectlRun } = require('./run');
const { awaitExecution } = require('./helpers');

const config = require('./config');

async function run() {
  const cfg = config.get();
  if (!cfg) {
    core.setFailed('Invalid configuration.');
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    core.warning('No GITHUB_TOKEN detected.');
    core.warning(
      'Be sure to explicitly set GITHUB_TOKEN in saucectl-run-action step of your workflow.',
    );
    core.warning(
      'Unauthenticated usage may result in "API rate limit exceeded" error.',
    );
  }

  // Install saucectl
  if (!(await install({ versionSpec: cfg.saucectlVersion }))) {
    return;
  }

  // Run it to confirm version
  const child = childProcess.spawn('saucectl', ['--version']);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  const exitCode = await awaitExecution(child);
  core.info(`ExitCode: ${exitCode}`);

  // Really execute saucectl
  if (!cfg.skipRun) {
    await saucectlRun(cfg);
  }
}

if (require.main === module) {
  run();
}
