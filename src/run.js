const core = require("@actions/core");
const fs = require('fs');
const { promisify } = require("util");
const { awaitExecution } = require("./helpers");

const lstat = promisify(fs.lstat)

function buildSaucectlArgs(opts) {
    const args = ['run'];
    if (opts.configurationFile) {
        args.push('-c', opts.configurationFile);
    }
    if (opts.runRegion) {
        args.push('--region', opts.runRegion);
    }
    if (opts.runEnvironment) {
        args.push('--test-env', opts.runEnvironment);
    }
    if (opts.suite) {
        args.push('--suite', opts.suite);
    }
}

async function saucectlRun(opts) {
    const { workingDirectory } = opts;

    if (workingDirectory) {
        const stats = await lstat(workingDirectory);
        if (!stats.isDirectory()) {
            core.setFailed(`${workingDirectory} does not exists.`);
            return false;
        }
        process.chdir(workingDirectory);
    }
    core.info("Launching saucectl !");

    const saucectlArgs = buildSaucectlArgs(opts);

    const child = childProcess.spawn('saucectl', saucectlArgs);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    const exitCode = await awaitExecution(child);
    core.info(`ExitCode: ${exitCode}`);

    return exitCode == 0;
};

module.exports = { saucectlRun };